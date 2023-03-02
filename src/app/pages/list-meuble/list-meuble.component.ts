import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';
import { IMMOBILIER } from '../import-excel-file/import-excel-file.component';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2'
import { CodificationService } from 'app/services/codification.service';
import { Codification } from 'app/shared/model/codification';


@Component({
  selector: 'list-meuble',
  templateUrl: './list-meuble.component.html',
  styleUrls: ['./list-meuble.component.css']
})
export class ListMeubleComponent implements OnInit {


  @ViewChild('n_inventaireTp', { static: true }) n_inventaireTp: TemplateRef<any>;
  @ViewChild('n_inventaire') n_inventaire: ElementRef<any>;

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

  @ViewChild('n_serieTp', { static: true }) n_serieTp: TemplateRef<any>;
  @ViewChild('n_serie') n_serie: ElementRef<any>;

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  public configuration: Config;
  public columns: Columns[]

  public data: Codification[] = [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  editRow: number;
  phone: any;
  age: any;
  company: any;
  name: any;

  form: FormGroup = new FormGroup({
    id_codification: new FormControl(0),
    code_guichet: new FormControl(''),
    n_inventaire: new FormControl(''),
    departement: new FormControl(''),
    direction: new FormControl(''),
    famille: new FormControl(''),
    libelle_famille: new FormControl(''),
    sous_libelle_famille: new FormControl(''),
    niveau: new FormControl(''),
    service: new FormControl(''),
    sous_famille: new FormControl(''),
    code_localisation: new FormControl(''),
    libelle_agence: new FormControl(''),
    libelle_localisation: new FormControl('')
  });
  loader: boolean = false;
  fileName = 'ExcelSheet.xlsx';

  constructor(
    private codificationService: CodificationService

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
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl, searchEnabled: false },
      { key: 'n_inventaire', title: 'N° INVENTAIRE', cellTemplate: this.n_inventaireTp },
      { key: 'code_guichet', title: 'CODE GUICHET', cellTemplate: this.code_guichetTp },
      { key: 'departement', title: 'DEPARTEMENT', cellTemplate: this.departementTp },
      { key: 'direction', title: 'DIRECTION', cellTemplate: this.directionTp },
      { key: 'famille', title: 'FAMILLE', cellTemplate: this.familleTp },
      { key: 'libelle_famille', title: 'LIBELLE FAMILLE', cellTemplate: this.libelle_familleTp },
      { key: 'sous_libelle_famille', title: 'SOUS LIBELLE FAMILLE', cellTemplate: this.sous_libelle_familleTp },
      { key: 'niveau', title: 'NIVEAU', cellTemplate: this.niveauTp },
      { key: 'service', title: 'SERVICE', cellTemplate: this.serviceTp },
      { key: 'sous_famille', title: 'SOUS FAMILLE', cellTemplate: this.sous_familleTp },
      { key: 'code_localisation', title: 'code localisation', cellTemplate: this.code_localisationTp },
      { key: 'libelle_agence', title: 'libelle agence ', cellTemplate: this.libelle_agenceTp },
      { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    ];
    this.init()

  }

  init() {
    this.getAllCodification()
  }

  exportexcel(): void {
    /* pass here the table id */
    // let element = document.getElementById('excel-table');
    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.fieldFileExcel(this.data));

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, this.fileName);

  }


  fieldFileExcel(data: Codification[]) {
    return data.map(
      (element) => {
        return {
          'CODE GUICHET': element.code_guichet,
          'FAMILLE ': element.famille,
          'SOUS FAMILLE': element.sous_famille,
          'LIBELLE FAMILLE': element.libelle_famille,
          'LIBELLE FAMILLE_1': element.sous_libelle_famille,
          'libelle agence ': element.libelle_agence,
          'code localisation': element.code_localisation,
          'NIVEAU': element.niveau,
          'libelle localisation': element.libelle_localisation,
          'DIRECTION': element.direction,
          'DEPARTEMENT': element.departement,
          'SERVICE': element.service
        }
      }
    )
  }


  create() {
    this.loader = true;
    console.log('Data to send : ', this.form.value)

    this.codificationService.createCodification(this.form.value as Codification).subscribe(
      {
        next: (result: any) => {
          console.log('Data: ', result.message);

          if (result?.message != undefined) {
            Swal.fire({
              title: 'Error',
              text: result?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            })
          } else {
            Swal.fire({
              title: 'Success',
              text: result?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })
            this.init()
            this.form.reset();

          }

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

  getAllCodification() {
    this.configuration.isLoading = true;

    this.codificationService.getAllCodification().subscribe(
      {
        next: (result: any) => {

          console.log('Data: ', result);
          Swal.fire({
            title: 'Success',
            text: result?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          })

          this.data = result.data;
          this.form.reset();
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

    var immobilier: IMMOBILIER;

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
      const updatedLine: Codification = {
        code_guichet: worksheetLine['CODE GUICHET'],
        famille: worksheetLine['FAMILLE '],
        n_inventaire: null,
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

  sendData() {
    console.log('Data to send : ', this.data)
    this.data = [];
    this.form.reset()
  }

  edit(rowIndex: number): void {
    this.editRow = rowIndex;
  }

  update(): void {

    let resul: Codification = this.data.find((obj, index) => index === this.editRow);
    // this.data = [
    //   ...this.data.map((obj, index) => {
    //     if (index === this.editRow) {
    //       return {
    //         code_guichet: this.code_guichet.nativeElement.value,
    //         service: this.service.nativeElement.value,
    //         n_inventaire: null,
    //         sous_famille: this.sous_famille.nativeElement.value,
    //         famille: this.famille.nativeElement.value,
    //         libelle_famille: this.libelle_famille.nativeElement.value,
    //         sous_libelle_famille: this.sous_libelle_famille.nativeElement.value,
    //         code_localisation: this.code_localisation.nativeElement.value,
    //         direction: this.direction.nativeElement.value,
    //         departement: this.departement.nativeElement.value,
    //         libelle_agence: this.libelle_agence.nativeElement.value,
    //         niveau: this.niveau.nativeElement.value,
    //         libelle_localisation: this.libelle_localisation.nativeElement.value,
    //         n_serie: null
    //       } as Codification;
    //     }
    //     return obj;
    //   }),
    // ] as Codification[];


    resul.code_guichet = this.code_guichet.nativeElement.value;
    resul.service= this.service.nativeElement.value
    resul.n_inventaire= this.n_inventaire.nativeElement.value
    resul.sous_famille= this.sous_famille.nativeElement.value
    resul.famille= this.famille.nativeElement.value
    resul.libelle_famille= this.libelle_famille.nativeElement.value
    resul.sous_libelle_famille= this.sous_libelle_famille.nativeElement.value
    resul.code_localisation= this.code_localisation.nativeElement.value
    resul.direction= this.direction.nativeElement.value
    resul.departement= this.departement.nativeElement.value
    resul.libelle_agence= this.libelle_agence.nativeElement.value
    resul.niveau= this.niveau.nativeElement.value
    resul.libelle_localisation= this.libelle_localisation.nativeElement.value
    resul.n_serie= this.n_serie?.nativeElement?.value || null

    this.editRow = -1;


    this.configuration.isLoading = true;

    console.table(resul)

    this.codificationService.updateCodification(resul.id_codification, resul).subscribe(
      {
        next: (data: any) => {
          this.configuration.isLoading = false;
          console.log('Data : ', data);

          Swal.fire({
            title: 'Success',
            // text: data?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          })

        },
        error: (error) => {
          console.log(error)
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
