import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { InventaireService } from 'app/services/inventaire.service';
import { PeriodeInventaireService } from 'app/services/periode-inventaire.service';
import { Inventaire } from 'app/shared/model/inventaire';
import { create } from 'domain';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';
import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';

@Component({
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit {

  @ViewChild('n_inventaireTp', { static: true }) n_inventaireTp: TemplateRef<any>;
  @ViewChild('n_inventaire') n_inventaire: ElementRef<any>;

  @ViewChild('libelle_immoTp', { static: true }) libelle_immoTp: TemplateRef<any>;
  @ViewChild('libelle_immo') libelle_immo: ElementRef<any>;

  @ViewChild('libelle_complementaireTp', { static: true }) libelle_complementaireTp: TemplateRef<any>;
  @ViewChild('libelle_complementaire') libelle_complementaire: ElementRef<any>;

  @ViewChild('n_serieTp', { static: true }) n_serieTp: TemplateRef<any>;
  @ViewChild('n_serie') n_serie: ElementRef<any>;

  @ViewChild('etatTp', { static: true }) etatTp: TemplateRef<any>;
  @ViewChild('etat') etat: ElementRef<any>;

  @ViewChild('nom_agentTp', { static: true }) nom_agentTp: TemplateRef<any>;
  @ViewChild('nom_agent') nom_agent: ElementRef<any>;

  @ViewChild('observationsTp', { static: true }) observationsTp: TemplateRef<any>;
  @ViewChild('observations') observations: ElementRef<any>;

  @ViewChild('date_inventaireTp', { static: true }) date_inventaireTp: TemplateRef<any>;
  @ViewChild('date_inventaire') date_inventaire: ElementRef<any>;


  @ViewChild('code_guichetTp', { static: true }) code_guichetTp: TemplateRef<any>;
  @ViewChild('code_guichet') code_guichet: ElementRef<any>;

  @ViewChild('departementTp', { static: true }) departementTp: TemplateRef<any>;
  @ViewChild('departement') departement: ElementRef<any>;

  @ViewChild('directionTp', { static: true }) directionTp: TemplateRef<any>;
  @ViewChild('direction') direction: ElementRef<any>;

  @ViewChild('familleTp', { static: true }) familleTp: TemplateRef<any>;
  @ViewChild('famille') famille: ElementRef<any>;

  @ViewChild('libelle_familleTp', { static: true }) libelle_familleTp: TemplateRef<any>;
  @ViewChild('libelle_famille') libelle_famille: ElementRef<any>;

  @ViewChild('sous_libelle_familleTp', { static: true }) sous_libelle_familleTp: TemplateRef<any>;
  @ViewChild('sous_libelle_famille') sous_libelle_famille: ElementRef<any>;

  @ViewChild('niveauTp', { static: true }) niveauTp: TemplateRef<any>;
  @ViewChild('niveau') niveau: ElementRef<any>;

  @ViewChild('serviceTp', { static: true }) serviceTp: TemplateRef<any>;
  @ViewChild('service') service: ElementRef<any>;

  @ViewChild('sous_familleTp', { static: true }) sous_familleTp: TemplateRef<any>;
  @ViewChild('sous_famille') sous_famille: ElementRef<any>;

  @ViewChild('code_localisationTp', { static: true }) code_localisationTp: TemplateRef<any>;
  @ViewChild('code_localisation') code_localisation: ElementRef<any>;

  @ViewChild('libelle_agenceTp', { static: true }) libelle_agenceTp: TemplateRef<any>;
  @ViewChild('libelle_agence') libelle_agence: ElementRef<any>;

  @ViewChild('libelle_localisationTp', { static: true }) libelle_localisationTp: TemplateRef<any>;
  @ViewChild('libelle_localisation') libelle_localisation: ElementRef<any>;

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  public configuration: Config;
  public columns: Columns[]

  public data: any[] = [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  editRow: number;
  phone: any;
  age: any;
  company: any;
  name: any;

  form: FormGroup = new FormGroup({
    id_periode_inventaire: new FormControl(0),
    libelle: new FormControl(''),
    n_bordereau: new FormControl(''),
    date_debut: new FormControl(''),
    date_fin: new FormControl(''),
    isActive: new FormControl(true),
  });
  loader: boolean;
  periodeInventaire: any;
  periodeInventaireValue: any;
  fileName = 'ExcelSheet.xlsx';


  constructor(
    private inventaireService: InventaireService,
    private periodeInventaireService: PeriodeInventaireService,

  ) { }

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.horizontalScroll = true;
    this.configuration.tableLayout = {
      style: STYLE.TINY,
      theme: THEME.LIGHT,
      borderless: true,
      hover: true,
      striped: false
    }

    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'action', title: 'ACTIONS', cellTemplate: this.actionTpl, searchEnabled: false },

      { key: 'n_inventaire',            title: 'N° INVENTAIRE', cellTemplate: this.n_inventaireTp },
      { key: 'libelle_immo',            title: 'LIBELLE IMMO', cellTemplate: this.libelle_immoTp },
      { key: 'libelle_localisation',    title: 'LIBELLE LOCALISATION', cellTemplate: this.libelle_localisationTp },
      { key: 'code_localisation',       title: 'CODE LOCALISATION', cellTemplate: this.code_localisationTp },
      { key: 'libelle_complementaire',  title: 'LIBELLE COMPLEMENTAIRE', cellTemplate: this.libelle_complementaireTp },

      // { key: 'n_serie',             title: 'N° SERIE',              cellTemplate: this.n_serieTp},
      { key: 'etat', title: 'ETAT', cellTemplate: this.etatTp },
      { key: 'nom_agent', title: 'NOM DE L\'AGENT', cellTemplate: this.nom_agentTp },
      { key: 'observations', title: 'OBSERVATIONS', cellTemplate: this.observationsTp },
      { key: 'date_inventaire', title: 'DATE INVENTAIRE', cellTemplate: this.date_inventaireTp },


      // { key: 'code_guichet',         title: 'CODE GUICHET',         cellTemplate: this.code_guichetTp},
      // { key: 'departement',          title: 'DEPARTEMENT',          cellTemplate: this.departementTp },
      // { key: 'direction',            title: 'DIRECTION',            cellTemplate: this.directionTp },
      // { key: 'famille',              title: 'FAMILLE',              cellTemplate: this.familleTp },
      // { key: 'libelle_famille',      title: 'LIBELLE FAMILLE',      cellTemplate: this.libelle_familleTp },
      // { key: 'sous_libelle_famille',    title: 'SOUS LIBELLE FAMILLE',    cellTemplate: this.sous_libelle_familleTp},
      // { key: 'niveau',               title: 'NIVEAU',               cellTemplate: this.niveauTp },
      // { key: 'service',              title: 'SERVICE',              cellTemplate: this.serviceTp },
      // { key: 'sous_famille',         title: 'SOUS FAMILLE',         cellTemplate: this.sous_familleTp },
      // { key: 'code_localisation',    title: 'code localisation',    cellTemplate: this.code_localisationTp },
      // { key: 'libelle_agence',       title: 'libelle agence ',      cellTemplate: this.libelle_agenceTp },
      // { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    ];

    this.init()
  }


  sendData() {
    this.loader = true;
    this.form.value.isActive = true;

    console.log('Data to send : ', this.form.value)

    this.periodeInventaireService.createPeriodeInventaire(this.form.value).subscribe(
      {
        next: (result: any) => {

          console.log('Data: ', result);
          Swal.fire({
            title: 'Success',
            text: result?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          })

          this.init()

          this.form.reset();
          this.loader = false;
        },
        error: (result: any) => {
          this.loader = false;
          console.error("ERROR : ", result)
          Swal.fire({
            title: 'Error',
            text: result?.message || '',
            icon: 'error',
            confirmButtonText: 'Retour'
          })
        }
      }
    )

  }

  init() {
    this.getAllPeriodeInventaire()
    this.getAllInventaire()
  }

  exportexcel(): void {
    /* pass here the table id */
    // let element = document.getElementById('excel-table');
    if (this.data.length == 0) {
      return;
    }

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.fieldFileExcel(this.data));

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, this.fileName);

  }


  fieldFileExcel(data: any[]) {

    return data.map(
      (element) => {
        return {

          'N° INVENTAIRE'                 : element?.codification?.n_inventaire,
          'LIBELLE IMMO'                  : element?.codification?.libelle_immo,
          'LIBELLE COMPLEMENTAIRE'        : element?.codification?.libelle_complementaire,
          'LIBELLE LOCALISATION'          : element?.libelle_localisation,
          'CODE LOCALISATION'             : element?.code_localisation,

          'FAMILLE'             : element?.codification?.famille,
          'SOUS FAMILLE'        : element?.codification?.sous_famille,
          'LIBELLE FAMILLE'     : element?.codification?.libelle_famille,
          'SOUS LIBELLE FAMILLE': element?.codification?.sous_libelle_famille,
          'LIBELLE AGENCE '     : element?.codification?.libelle_agence,
          'NIVEAU'              : element?.codification?.niveau,
          'DIRECTION'           : element?.codification?.direction,
          'DEPARTEMENT'         : element?.codification?.departement,
          'SERVICE'             : element?.codification?.service,
          "ETAT"                : element.etat,
          "NOM DE L'AGENT"      : element?.nom_agent,
          "OBSERVATION"         : element?.observations,
        }
      }
    )
  }

  getAllPeriodeInventaire() {
    this.periodeInventaireService.getAllPeriodeInventaire().subscribe(
      {
        next: (result: any) => {

          console.log('periodeInventaire: ', result);
          Swal.fire({
            title: 'Success',
            text: result?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          })

          this.periodeInventaire = result?.data;
          this.form.reset();
          this.loader = false;

        },
        error: (result: any) => {
          this.loader = false;
          this.configuration.isLoading = false;
          console.error("ERROR : ", result)
          Swal.fire({
            title: 'Error',
            text: result?.message || '',
            icon: 'error',
            confirmButtonText: 'Retour'
          })
        }
      }
    )
  }

  getAllInventaire() {
    this.configuration.isLoading = true;

    this.inventaireService.getAllInventaire().subscribe(
      {
        next: (result: any) => {

          console.log('inventaireService: ', result);

          if (result.status) {
            Swal.fire({
              title: 'Success',
              text: result?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })

            this.data = result.data.filter(x => x.periode_inventtaire.isActive == true);

            this.data = this.data.sort((a, b) => Date.parse(b.date_inventaire) - Date.parse(a.date_inventaire))
          } else {
            Swal.fire({
              title: 'Error',
              text: result?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            })
          }

          this.loader = false;
          this.configuration.isLoading = false;

        },
        error: (result: any) => {
          this.loader = false;
          this.configuration.isLoading = false;
          console.error("ERROR : ", result)
          Swal.fire({
            title: 'Error',
            text: result?.message || '',
            icon: 'error',
            confirmButtonText: 'Retour'
          })
        }
      }
    )
  }


  getAllByPeriodeInventaire(id_periode: number) {
    console.log(id_periode)
    this.configuration.isLoading = true;
    this.loader = true;

    this.inventaireService.getByPeriode(id_periode).subscribe(
      {
        next: (result: any) => {

          console.log('inventaireService: ', result);

          if (result.status) {
            Swal.fire({
              title: 'Success',
              text: result?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })

            this.data = result.data;
          } else {
            Swal.fire({
              title: 'Erreur',
              text: result?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            })
          }

          this.loader = false;
          this.configuration.isLoading = false;

        },
        error: (result: any) => {
          this.loader = false;
          this.configuration.isLoading = false;
          console.error("ERROR : ", result)
          Swal.fire({
            title: 'Error',
            text: result?.message || '',
            icon: 'error',
            confirmButtonText: 'Retour'
          })
        }
      }
    )
  }

  getFile(event: any) {
    // this.open()
    // console.log(event)

    this.file = event.target.files[0];

    // console.log('data')

    var immobilier: any;

    this.fileReader(this.file, immobilier);
  }

  private fileReader(file: any, line: any) {
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();

      for (let i = 0; i !== data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }

      const bstr = arr.join('');
      const workbook = xlsx.read(bstr, { type: 'binary', cellDates: true });
      console.log(workbook)
      const first_sheet_name = workbook.SheetNames[4];

      const worksheet = workbook.Sheets[first_sheet_name];
      this.worksheet = xlsx.utils.sheet_to_json(worksheet, { raw: true });

      /**
       * Call matching function
       */
      console.log(this.worksheet)

      this.matchingCell(this.worksheet, [], line);
    };
    fileReader.readAsArrayBuffer(file);
  }

  private matchingCell(worksheet: any, monTab: any, line: any) {
    monTab.value = [];

    for (let i = 0; i < worksheet.length; i++) {
      const worksheetLine = worksheet[i];
      const updatedLine: any = {
        code_guichet: worksheetLine['CODE GUICHET'],
        famille: worksheetLine['FAMILLE '],
        sous_famille: worksheetLine['SOUS FAMILLE'],
        libelle_famille: worksheetLine['LIBELLE FAMILLE'],
        sous_libelle_famille: worksheetLine['LIBELLE FAMILLE_1'],
        libelle_agence: worksheetLine['libelle agence '],
        code_localisation: worksheetLine['code localisation'],
        niveau: worksheetLine['NIVEAU'],
        libelle_localisation: worksheetLine['libelle localisation'],
        direction: worksheetLine['DIRECTION'],
        departement: worksheetLine['DEPARTEMENT'],
        service: worksheetLine['SERVICE'],
      };

      line = { ...line, ...updatedLine };
      monTab.value.push(line);
    }
    this.data = monTab.value;
    // console.log(monTab.value)

    // return monTab;

  }

  edit(rowIndex: number): void {
    this.editRow = rowIndex;
  }

  update(): void {

    let resul: any = this.data.find((obj, index) => index === this.editRow);
    this.configuration.isLoading = true;
    this.editRow = -1;

    resul.etat                 = this.etat.nativeElement.value
    resul.nom_agent            = this.nom_agent.nativeElement.value
    resul.observations         = this.observations.nativeElement.value
    resul.libelle_localisation = this.libelle_localisation.nativeElement.value
    resul.code_localisation    = this.code_localisation.nativeElement.value


    this.inventaireService.updateInventaire(resul.id, resul).subscribe(
      {
        next: (data: any) => {
          this.configuration.isLoading = false;
          console.log('Data : ', data);

          if (data.status) {
            this.init()
            Swal.fire({
              title: 'Success',
              text: data?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })

          } else {
            Swal.fire({
              title: 'Erreur',
              text: data?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            })

          }


        },
        error: (error) => {
          Swal.fire({
            title: 'Erreur',
            text: error?.message || '',
            icon: 'error',
            confirmButtonText: 'Retour'
          })

        }
      }
    )

  }

}
