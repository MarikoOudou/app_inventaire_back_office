import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PeriodeInventaireService } from 'app/services/periode-inventaire.service';
import { PeriodeInventaire } from 'app/shared/model/periodeInventaire';
import { Columns, Config, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';

@Component({
  templateUrl: './periode-inventaire.component.html',
  styleUrls: ['./periode-inventaire.component.css']
})
export class PeriodeInventaireComponent implements OnInit {

  @ViewChild('libelleTp', { static: true })libelleTp: TemplateRef<any>;
  @ViewChild('libelle') libelle: ElementRef<any>;

  @ViewChild('n_bordereauTp', { static: true })n_bordereauTp: TemplateRef<any>;
  @ViewChild('n_bordereau') n_bordereau: ElementRef<any>;

  @ViewChild('isActiveTp', { static: true })isActiveTp: TemplateRef<any>;
  @ViewChild('isActive') isActive: ElementRef<any>;

  @ViewChild('date_debutTp', { static: true })date_debutTp: TemplateRef<any>;
  @ViewChild('date_debut') date_debut: ElementRef<any>;

  @ViewChild('date_finTp', { static: true })date_finTp: TemplateRef<any>;
  @ViewChild('date_fin') date_fin: ElementRef<any>;

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;


  public configuration: Config;
  public columns: Columns[];
  editRow: number;


  public data: PeriodeInventaire[]= [];
  form: FormGroup = new FormGroup({
    id_periode_inventaire: new FormControl(0),
    libelle              : new FormControl(''),
    n_bordereau          : new FormControl(''),
    date_debut           : new FormControl(''),
    date_fin             : new FormControl(''),
    isActive             : new FormControl(true),
  });
  loader: boolean = false;
  periodeInventaire: any[] = [];

  constructor(
    private periodeInventaireService: PeriodeInventaireService,) { }

  ngOnInit(): void {
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
      { key: 'action',               title: 'ACTIONS' ,             cellTemplate: this.actionTpl, searchEnabled: false },

      { key: 'libelle',              title: 'LIBELLE',              cellTemplate: this.libelleTp},
      { key: 'n_bordereau',          title: 'N° BORDEREAU',         cellTemplate: this.n_bordereauTp},
      { key: 'date_debut',           title: 'DATE DEBUT',           cellTemplate: this.date_debutTp},
      { key: 'date_fin',             title: 'DATE FIN',             cellTemplate: this.date_finTp},
      { key: 'isActive',             title: 'STATUT',               cellTemplate: this.isActiveTp},

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

  }

  getAllPeriodeInventaire () {
    this.periodeInventaireService.getAllPeriodeInventaire().subscribe(
      {
        next: (result: any) => {

          console.log('periodeInventaire: ', result);

          if (result.status) {
            Swal.fire({
              title: 'Success',
              text: result?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            })
          this.data = result?.data;

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

  activeOrDiseable(periodeInventaire: PeriodeInventaire, isActive: boolean) {
    // console.log(periodeInventaire)
    periodeInventaire.isActive = !isActive;
    this.periodeInventaireService.activeOrDiseable(periodeInventaire.id, periodeInventaire).subscribe(
      {
        next: (data: any) => {
          this.configuration.isLoading = false;
          console.log('Data : ', data);

          Swal.fire({
            title: 'Success',
            // text: data?.message || '',
            icon: 'success',
            confirmButtonText: 'Retour'
          });

          this.init()

        },
        error: (error) => {
          this.configuration.isLoading = false;

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

  update(): void {
    // console.log ((this.data.find((x, index) => index === this.editRow) as any).map(x  => {return {
    //   n_bordereau: this.n_bordereau.nativeElement.value,
    //   date_debut: this.date_debut.nativeElement.value,
    //   date_fin: this.date_fin.nativeElement.value,
    //   isActive: this.isActive.nativeElement.value,
    // }}))
    let resul: PeriodeInventaire;
    resul = this.data.find((obj, index) => index === this.editRow)

     resul.libelle= this.libelle.nativeElement.value,
     resul.n_bordereau= this.n_bordereau.nativeElement.value,
     resul.date_debut =this.date_debut.nativeElement.value,
     resul.date_fin= this.date_fin.nativeElement.value,
    //  resul.isActive= this.isActive.nativeElement.value,
    this.configuration.isLoading = true;
    console.log(resul)
    this.editRow = -1;

     this.periodeInventaireService.updatePeriodeInventaire(resul.id, resul).subscribe(
      {
        next: (data: any) => {
          this.configuration.isLoading = false;
          console.log('Data : ', data);

          if (data.status) {

            Swal.fire({
              title: 'Success',
              // text: data?.message || '',
              icon: 'success',
              confirmButtonText: 'Retour'
            });

            this.init()

          } else {
            Swal.fire({
              title: 'Error',
              // text: data?.message || '',
              icon: 'error',
              confirmButtonText: 'Retour'
            });
          }


        },
        error: (error) => {
          this.configuration.isLoading = false;

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
