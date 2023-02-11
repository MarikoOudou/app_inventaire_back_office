import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';
import { IMMOBILIER } from '../import-excel-file/import-excel-file.component';
import * as xlsx from 'xlsx';
import { Codification, CodificationService } from 'app/core/api/v1';
import Swal from 'sweetalert2'


@Component({
  selector: 'list-meuble',
  templateUrl: './list-meuble.component.html',
  styleUrls: ['./list-meuble.component.css']
})
export class ListMeubleComponent implements OnInit {

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

  @ViewChild('libelle_famille_1Tp', { static: true }) libelle_famille_1Tp: TemplateRef<any>;
  @ViewChild('libelle_famille_1') libelle_famille_1: ElementRef<any>;

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
    departement: new FormControl(''),
    direction: new FormControl(''),
    famille: new FormControl(''),
    libelle_famille: new FormControl(''),
    libelle_famille_1: new FormControl(''),
    niveau: new FormControl(''),
    service: new FormControl(''),
    sous_famille: new FormControl(''),
    codeLocalisation: new FormControl(''),
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
    this.init()
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
      { key: 'code_guichet', title: 'CODE GUICHET', cellTemplate: this.code_guichetTp },
      { key: 'departement', title: 'DEPARTEMENT', cellTemplate: this.departementTp },
      { key: 'direction', title: 'DIRECTION', cellTemplate: this.directionTp },
      { key: 'famille', title: 'FAMILLE', cellTemplate: this.familleTp },
      { key: 'libelle_famille', title: 'LIBELLE FAMILLE', cellTemplate: this.libelle_familleTp },
      { key: 'libelle_famille_1', title: 'LIBELLE FAMILLE 1', cellTemplate: this.libelle_famille_1Tp },
      { key: 'niveau', title: 'NIVEAU', cellTemplate: this.niveauTp },
      { key: 'service', title: 'SERVICE', cellTemplate: this.serviceTp },
      { key: 'sous_famille', title: 'SOUS FAMILLE', cellTemplate: this.sous_familleTp },
      { key: 'codeLocalisation', title: 'code localisation', cellTemplate: this.code_localisationTp },
      { key: 'libelle_agence', title: 'libelle agence ', cellTemplate: this.libelle_agenceTp },
      { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    ];
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

  create() {
    this.loader = true;
    console.log('Data to send : ', this.form.value)

    this.codificationService.createCodification(this.form.value as Codification).subscribe(
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

  getAllCodification() {
    this.configuration.isLoading = true;

    this.codificationService.getCodification().subscribe(
      {
        next: (result: any) => {

          console.log('Data: ', result);
          Swal.fire({
            title: 'Success',
            text: result?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          })

          this.data = result;
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
        sous_famille: worksheetLine['SOUS FAMILLE'],
        libelle_famille: worksheetLine['LIBELLE FAMILLE'],
        libelle_famille_1: worksheetLine['LIBELLE FAMILLE_1'],
        libelle_agence: worksheetLine['libelle agence '],
        codeLocalisation: worksheetLine['code localisation'],
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

  fieldFileExcel (data: Codification[]) {
   return data.map(
      (element) => {
        return {
          'CODE GUICHET'        : element.code_guichet,
          'FAMILLE '            : element.famille,
          'SOUS FAMILLE'        : element.sous_famille,
          'LIBELLE FAMILLE'     : element.libelle_famille,
          'LIBELLE FAMILLE_1'   : element.libelle_famille_1,
          'libelle agence '     : element.libelle_agence,
          'code localisation'   : element.codeLocalisation,
          'NIVEAU'              : element.niveau,
          'libelle localisation': element.libelle_localisation,
          'DIRECTION'           : element.direction,
          'DEPARTEMENT'         : element.departement,
          'SERVICE'             : element.service
        }
      }
    )
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
    this.data = [
      ...this.data.map((obj, index) => {
        if (index === this.editRow) {
          return {
            code_guichet: this.code_guichet.nativeElement.value,
            service: this.service.nativeElement.value,
            sous_famille: this.sous_famille.nativeElement.value,
            famille: this.famille.nativeElement.value,
            libelle_famille: this.libelle_famille.nativeElement.value,
            libelle_famille_1: this.libelle_famille_1.nativeElement.value,
            codeLocalisation: this.code_localisation.nativeElement.value,
            direction: this.direction.nativeElement.value,
            departement: this.departement.nativeElement.value,
            libelle_agence: this.libelle_agence.nativeElement.value,
            niveau: this.niveau.nativeElement.value,
            libelle_localisation: this.libelle_localisation.nativeElement.value,
          } as Codification;
        }
        return obj;
      }),
    ] as IMMOBILIER[];
    this.editRow = -1;
  }


}
