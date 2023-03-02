import { Component, OnInit, TemplateRef, ViewChild,   ElementRef, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Columns, Config, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2'
import { Codification } from 'app/shared/model/codification';
import { CodificationService } from 'app/services/codification.service';

export interface IMMOBILIER {
  id                  ?: string,
  code_guichet        ?: string,
  departement         ?: string,
  direction           ?: string,
  famille             ?: string,
  libelle_famille     ?: string,
  sous_libelle_famille   ?: string,
  niveau              ?: string,
  service             ?: string,
  sous_famille        ?: string,
  code_localisation   ?: string,
  libelle_agence      ?: string,
  libelle_localisation?: string,
}


@Component({
  selector: 'import-excel-file',
  templateUrl: './import-excel-file.component.html',
  styleUrls: ['./import-excel-file.component.css']
})
export class ImportExcelFileComponent implements OnInit {

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

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  public configuration: Config;
  public columns: Columns[]

  public data: Codification[]= [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  editRow: number;
  phone: any;
  age: any;
  company: any;
  name: any;

  loader: boolean = false;

  form: FormGroup = new FormGroup({
    file_excel: new FormControl(''),
  });



  constructor(
    private codificationService: CodificationService
  ) { }

  ngOnInit(): void {
    // this.codificationService.getCodification().subscribe(
    //   {
    //     next: (data: any) => {
    //       console.log('data : ', data)

    //     }
    //   }
    // )
    this.configuration = { ...DefaultConfig };
    this.configuration.horizontalScroll = true;
    this.configuration.tableLayout =  {
      style: STYLE.TINY ,
      theme: THEME.LIGHT,
      borderless: true,
      hover: true,
      striped: false
    }

    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'action',               title: 'Actions' ,             cellTemplate: this.actionTpl, searchEnabled: false },
      { key: 'n_inventaire',         title: 'N° INVENTAIRE',        cellTemplate: this.n_inventaireTp},
      { key: 'code_guichet',         title: 'CODE GUICHET',         cellTemplate: this.code_guichetTp},
      { key: 'departement',          title: 'DEPARTEMENT',          cellTemplate: this.departementTp },
      { key: 'direction',            title: 'DIRECTION',            cellTemplate: this.directionTp },
      { key: 'famille',              title: 'FAMILLE',              cellTemplate: this.familleTp },
      { key: 'libelle_famille',      title: 'LIBELLE FAMILLE',      cellTemplate: this.libelle_familleTp },
      { key: 'sous_libelle_famille', title: 'SOUS LIBELLE FAMILLE ',cellTemplate: this.sous_libelle_familleTp},
      { key: 'niveau',               title: 'NIVEAU',               cellTemplate: this.niveauTp },
      { key: 'service',              title: 'SERVICE',              cellTemplate: this.serviceTp },
      { key: 'sous_famille',         title: 'SOUS FAMILLE',         cellTemplate: this.sous_familleTp },
      { key: 'codeLocalisation',     title: 'code localisation',    cellTemplate: this.code_localisationTp },
      { key: 'libelle_agence',       title: 'libelle agence ',      cellTemplate: this.libelle_agenceTp },
      { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    ];
  }

  getFile(event: any) {
    // this.open()
    // console.log(event)

    this.file = event.target.files[0];

    // console.log('data')

    var immobilier: Codification;

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
      const first_sheet_name = workbook.SheetNames[0];

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
        n_inventaire: "INV00" + i,
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

      line = {...line, ...updatedLine};
      monTab.value.push(line);
    }
    this.data = monTab.value;
    // console.log(monTab.value)

    // return monTab;

  }

  sendData() {
    // Swal.fire({
    //   title: 'Error!',
    //   text: 'Do you want to continue',
    //   icon: 'error',
    //   confirmButtonText: 'Cool'
    // })
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'No, cancel!',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire(
    //       'Deleted!',
    //       'Your file has been deleted.',
    //       'success'
    //     )
    //   } else {
    //     Swal.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })
    this.loader = true;
    console.log('Data to send : ', this.data)

    this.codificationService.createsCodification(this.data).subscribe(
      {
        next: (result: any) => {
          console.log('Data: ', result);

          if (result.status) {
            Swal.fire({
              title: 'Success',
              text: result?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })

            this.data = [];
            this.form.reset();
          } else {
            Swal.fire({
              title: 'Error',
              text: result?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            })
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
            sous_libelle_famille: this.sous_libelle_famille.nativeElement.value,
            codeLocalisation: this.code_localisation.nativeElement.value,
            direction: this.direction.nativeElement.value,
            departement: this.departement.nativeElement.value,
            libelle_agence: this.libelle_agence.nativeElement.value,
            niveau: this.niveau.nativeElement.value,
            libelle_localisation: this.libelle_localisation.nativeElement.value,
            n_inventaire: this.n_inventaire.nativeElement.value,
          } as Codification;
        }
        return obj;
      }),
    ] as Codification[];
    this.editRow = -1;
  }


}
