import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2'
import { CodificationService } from 'app/services/codification.service';


@Component({
  selector: 'import-excel-file',
  templateUrl: './import-excel-file.component.html',
  styleUrls: ['./import-excel-file.component.css']
})
export class ImportExcelFileComponent implements OnInit {

  public data: any[]= [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  loader: boolean = false;
  form: FormGroup = new FormGroup({
    file_excel: new FormControl(''),
  });

  constructor(
    private codificationService: CodificationService
  ) { }

  ngOnInit(): void { }

  getFile(event: any) {
    this.file = event.target.files[0];
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
      // console.log(workbook)
      const first_sheet_name = workbook.SheetNames[0];
      // console.log(first_sheet_name)

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
        n_inventaire: worksheetLine['N°INVENTAIRE'],
        libelle_immo: worksheetLine['LIBELLE IMMO'],
        code_localisation: worksheetLine['CODE LOCALISATION'],
        n_serie: worksheetLine['N° SERIE'],
        libelle_localisation: worksheetLine['libelle localisation'] || worksheetLine['LIBELLE LOCALISATION'],
        libelle_complementaire: worksheetLine['libelle complementaire'],

        code_guichet: worksheetLine['CODE GUICHET'], //
        famille: worksheetLine['FAMILLE '] || worksheetLine['Famille'] || worksheetLine['FAMILLE'] || worksheetLine['famille'],
        sous_famille: worksheetLine['SOUS FAMILLE'] ||  worksheetLine['Sous famille'],
        libelle_famille: worksheetLine['LIBELLE FAMILLE'],
        sous_libelle_famille: worksheetLine['LIBELLE FAMILLE_1'],
        libelle_agence: worksheetLine['libelle agence '],
        niveau: worksheetLine['NIVEAU'],
        direction: worksheetLine['DIRECTION'],
        departement: worksheetLine['DEPARTEMENT'],
        service: worksheetLine['SERVICE'],
      };

      line = {...line, ...updatedLine};
      monTab.value.push(line);
    }
    this.data = monTab.value;

  }

  sendData() {
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

            this.data = result.data;
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

  eventLister(data: any) {
    this.data = data
  }

}
