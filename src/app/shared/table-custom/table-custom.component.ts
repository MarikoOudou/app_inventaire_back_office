import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';

@Component({
  selector: 'table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.css']
})
export class TableCustomComponent implements OnInit {


  @ViewChild('n_inventaireTp', { static: true }) n_inventaireTp: TemplateRef<any>;
  @ViewChild('n_inventaire') n_inventaire: ElementRef<any>;

  @ViewChild('libelle_immoTp', { static: true }) libelle_immoTp: TemplateRef<any>;
  @ViewChild('libelle_immo') libelle_immo: ElementRef<any>;

  @ViewChild('libelle_complementaireTp', { static: true }) libelle_complementaireTp: TemplateRef<any>;
  @ViewChild('libelle_complementaire') libelle_complementaire: ElementRef<any>;

  @ViewChild('n_serieTp', { static: true }) ln_serieTp: TemplateRef<any>;
  @ViewChild('n_serie') n_serie: ElementRef<any>;

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
  editRow: number;


  @Input() data: any[] = [];
  @Output() updateData: EventEmitter<any> = new EventEmitter();

  constructor() { }

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

      { key: 'n_inventaire', title: 'N° INVENTAIRE', cellTemplate: this.n_inventaireTp },
      { key: 'libelle_immo', title: 'LIBELLE IMMO', cellTemplate: this.libelle_immoTp },
      { key: 'libelle_localisation', title: 'LIBELLE LOCALISATION', cellTemplate: this.libelle_localisationTp },
      { key: 'code_localisation', title: 'CODE LOCALISATION', cellTemplate: this.code_localisationTp },
      { key: 'libelle_complementaire', title: 'LIBELLE COMPLEMENTAIRE', cellTemplate: this.libelle_complementaireTp },

      { key: 'code_guichet', title: 'CODE GUICHET', cellTemplate: this.code_guichetTp },
      { key: 'departement', title: 'DEPARTEMENT', cellTemplate: this.departementTp },
      { key: 'direction', title: 'DIRECTION', cellTemplate: this.directionTp },
      { key: 'famille', title: 'FAMILLE', cellTemplate: this.familleTp },
      { key: 'libelle_famille', title: 'LIBELLE FAMILLE', cellTemplate: this.libelle_familleTp },
      { key: 'sous_libelle_famille', title: 'SOUS LIBELLE FAMILLE ', cellTemplate: this.sous_libelle_familleTp },
      { key: 'niveau', title: 'NIVEAU', cellTemplate: this.niveauTp },
      { key: 'service', title: 'SERVICE', cellTemplate: this.serviceTp },
      { key: 'sous_famille', title: 'SOUS FAMILLE', cellTemplate: this.sous_familleTp },
      { key: 'libelle_agence', title: 'LIBELLE AGENCE', cellTemplate: this.libelle_agenceTp },
    ];

  }

  edit(rowIndex: number): void {
    this.editRow = rowIndex;
  }

  update(): void {
    let resul: any = this.data.find((obj, index) => index === this.editRow);

    resul.code_guichet            = this.code_guichet.nativeElement.value || "";
    resul.service                 = this.service.nativeElement.value || "";
    resul.libelle_immo            = this.libelle_immo.nativeElement.value || "";
    resul.sous_famille            = this.sous_famille.nativeElement.value || "";
    resul.famille                 = this.famille.nativeElement.value || "";
    resul.libelle_famille         = this.libelle_famille.nativeElement.value || "";
    resul.sous_libelle_famille    = this.sous_libelle_famille.nativeElement.value || "";
    resul.code_localisation       = this.code_localisation.nativeElement.value || "";
    resul.libelle_complementaire  = this.libelle_complementaire.nativeElement.value || "";
    resul.direction               = this.direction.nativeElement.value || "";
    resul.departement             = this.departement.nativeElement.value || "";
    resul.libelle_agence          = this.libelle_agence.nativeElement.value || "";
    resul.niveau                  = this.niveau.nativeElement.value || "";
    resul.libelle_localisation    = this.libelle_localisation.nativeElement.value || "";
    resul.n_inventaire            = this.n_inventaire.nativeElement.value || "";

    this.editRow = -1;
    this.updateData.emit(resul);


  }

}
