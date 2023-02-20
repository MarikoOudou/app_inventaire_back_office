import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Columns, Config, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2'
import { Users, UsersService } from 'app/core/api/v1';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('action') action: ElementRef<any>;

  @ViewChild('fullnameTp', { static: true }) fullnameTp: TemplateRef<any>;
  @ViewChild('fullname') fullname: ElementRef<any>;

  @ViewChild('emailTp', { static: true }) emailTp: TemplateRef<any>;
  @ViewChild('email') email: ElementRef<any>;

  @ViewChild('typeUserTp', { static: true }) typeUserTp: TemplateRef<any>;
  @ViewChild('typeUser') typeUser: ElementRef<any>;

  public configuration: Config;
  public columns: Columns[] = []

  public data: Users[] = [];

  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    typeUser: new FormControl(''),
    email: new FormControl(''),
  });
  loader: boolean = false;
  fileName = 'ExcelSheet.xlsx';
  editRow: number;

  constructor(
    private usersService: UsersService
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
      { key: 'fullname', title: 'NOM ET PRENOM (S)', cellTemplate: this.fullnameTp },
      { key: 'email', title: 'EMAIL', cellTemplate: this.emailTp },
      { key: 'typeUser', title: 'FONCTION', cellTemplate: this.typeUserTp },
    ];
    this.getAllUsers()
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

  
  fieldFileExcel(data: Users[]) {
    return data
    
    // .map(
    //   (element) => {
    //     return {
    //       'CODE GUICHET': element.code_guichet,
    //       'FAMILLE ': element.famille,
    //       'SOUS FAMILLE': element.sous_famille,
    //       'LIBELLE FAMILLE': element.libelle_famille,
    //       'LIBELLE FAMILLE_1': element.sous_libelle_famille,
    //       'libelle agence ': element.libelle_agence,
    //       'code localisation': element.codeLocalisation,
    //       'NIVEAU': element.niveau,
    //       'libelle localisation': element.libelle_localisation,
    //       'DIRECTION': element.direction,
    //       'DEPARTEMENT': element.departement,
    //       'SERVICE': element.service
    //     }
    //   }
    // )
  }


  create() {
    this.loader = true;
    console.log('Data to send : ', this.form.value)

    this.usersService.create(this.form.value as Users).subscribe(
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
            // this.init()
            this.getAllUsers()
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

  getAllUsers() {
    this.configuration.isLoading = true;

    this.usersService.getAll().subscribe(
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

  edit(rowIndex: number): void {
    this.editRow = rowIndex;
  }
  
  update(): void {
    // this.data = [
    //   ...this.data.map((obj, index) => {
    //     if (index === this.editRow) {
    //       return {
    //         code_guichet: this.code_guichet.nativeElement.value,
    //         service: this.service.nativeElement.value,
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
    //       } as Inventaire;
    //     }
    //     return obj;
    //   }),
    // ] as Inventaire[];
    let resul: Users = this.data.find((obj, index) => index === this.editRow);
    this.configuration.isLoading = true;
    this.editRow = -1;

    resul.fullname= this.fullname.nativeElement.value
    resul.email= this.email.nativeElement.value
    resul.typeUser= this.typeUser.nativeElement.value
    // resul.  famille= this.famille.nativeElement.value,
    // resul.  libelle_famille= this.libelle_famille.nativeElement.value,
    // resul.  sous_libelle_famille= this.sous_libelle_famille.nativeElement.value,
    // resul.  code_localisation= this.code_localisation.nativeElement.value,
    // resul.  direction= this.direction.nativeElement.value,
    // resul.  departement= this.departement.nativeElement.value,
    // resul.  libelle_agence= this.libelle_agence.nativeElement.value,
    // resul.niveau= this.niveau.nativeElement.value,
    //         resul.  libelle_localisation= this.libelle_localisation.nativeElement.value,
    

    this.usersService.update(resul.userId, resul).subscribe(
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
