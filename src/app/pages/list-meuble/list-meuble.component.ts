import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';
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



  // public configuration: Config;
  // public columns: Columns[]

  public data: any[] = [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  editRow: number;


  form: FormGroup = new FormGroup({
    id_codification: new FormControl(0),
    libelle_complementaire: new FormControl('', [Validators.required]),
    libelle_immo: new FormControl('', [Validators.required]),
    code_guichet: new FormControl(''),
    n_inventaire: new FormControl('', [Validators.required]),
    departement: new FormControl(''),
    direction: new FormControl(''),
    famille: new FormControl(''),
    libelle_famille: new FormControl(''),
    sous_libelle_famille: new FormControl(''),
    niveau: new FormControl(''),
    service: new FormControl(''),
    sous_famille: new FormControl(''),
    code_localisation: new FormControl('', [Validators.required]),
    libelle_agence: new FormControl(''),
    libelle_localisation: new FormControl('', [Validators.required])
  });
  loader: boolean = false;
  fileName = 'ExcelSheet.xlsx';

  constructor(
    private codificationService: CodificationService

  ) { }

  ngOnInit(): void {
    // this.configuration = { ...DefaultConfig };
    // this.configuration.horizontalScroll = true;
    // this.configuration.tableLayout = {
    //   style: STYLE.TINY,
    //   theme: THEME.LIGHT,
    //   borderless: true,
    //   hover: true,
    //   striped: false
    // }

    // this.configuration.searchEnabled = true;
    // // ... etc.
    // this.columns = [
    //   { key: 'action', title: 'Actions', cellTemplate: this.actionTpl, searchEnabled: false },
    //   { key: 'n_inventaire', title: 'N° INVENTAIRE', cellTemplate: this.n_inventaireTp },
    //   { key: 'code_guichet', title: 'CODE GUICHET', cellTemplate: this.code_guichetTp },
    //   { key: 'departement', title: 'DEPARTEMENT', cellTemplate: this.departementTp },
    //   { key: 'direction', title: 'DIRECTION', cellTemplate: this.directionTp },
    //   { key: 'famille', title: 'FAMILLE', cellTemplate: this.familleTp },
    //   { key: 'libelle_famille', title: 'LIBELLE FAMILLE', cellTemplate: this.libelle_familleTp },
    //   { key: 'sous_libelle_famille', title: 'SOUS LIBELLE FAMILLE', cellTemplate: this.sous_libelle_familleTp },
    //   { key: 'niveau', title: 'NIVEAU', cellTemplate: this.niveauTp },
    //   { key: 'service', title: 'SERVICE', cellTemplate: this.serviceTp },
    //   { key: 'sous_famille', title: 'SOUS FAMILLE', cellTemplate: this.sous_familleTp },
    //   { key: 'code_localisation', title: 'code localisation', cellTemplate: this.code_localisationTp },
    //   { key: 'libelle_agence', title: 'libelle agence ', cellTemplate: this.libelle_agenceTp },
    //   { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    // ];
    this.init()

  }

  init() {
    this.getAllCodification()
  }

  exportexcel(): void {

    if (this.data.length == 0) {
      return;
    }
    /* pass here the table id */
    // let element = document.getElementById('excel-table');
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
          'N° INVENTAIRE'                 : element?.n_inventaire,
          'LIBELLE IMMO'                  : element?.libelle_immo,
          'LIBELLE COMPLEMENTAIRE'        : element?.libelle_complementaire,
          'LIBELLE LOCALISATION'          : element?.libelle_localisation,
          'CODE LOCALISATION'             : element?.code_localisation,

          'CODE GUICHET': element.code_guichet,
          'FAMILLE': element.famille,
          'SOUS FAMILLE': element.sous_famille,
          'LIBELLE FAMILLE': element.libelle_famille,
          'LIBELLE FAMILLE_1': element.sous_libelle_famille,
          'LIBELLE AGENCE': element.libelle_agence,
          'NIVEAU': element.niveau,
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
    // this.configuration.isLoading = true;

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
          this.data = this.data.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))

          this.form.reset();
          this.loader = false;
          // this.configuration.isLoading = false;

        },
        error: (result: any) => {
          this.loader = false;
          // this.configuration.isLoading = false;
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

  edit(rowIndex: number): void {
    this.editRow = rowIndex;
  }

  eventLister(data: any) {
    console.log(data)
    this.update(data)
  }

  update(resul: any): void {

    Swal.showLoading()

    this.codificationService.updateCodification(resul.id_codification, resul).subscribe(
      {
        next: (data: any) => {
          console.log('Data : ', data);

          if (data.status) {

            Swal.fire({
              title: 'Success',
              text: data?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })
            this.init()
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
