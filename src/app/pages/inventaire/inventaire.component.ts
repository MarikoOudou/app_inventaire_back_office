import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { Config } from 'protractor';
import * as xlsx from 'xlsx';
import { IMMOBILIER } from '../import-excel-file/import-excel-file.component';

export interface INVENTAIRE extends IMMOBILIER {
  id             ?: string,
  n_inventaire   ?: string,
  n_serie        ?: string,
  etat           ?: string, // bon, defaillant
  nom_agent      ?: any,
  observations   ?: string,
  date_inventaire?: string,
}

@Component({
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit {

  @ViewChild('n_inventaireTp', { static: true }) n_inventaireTp: TemplateRef<any>;
  @ViewChild('n_inventaire') n_inventaire: ElementRef<any>;

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

  public data: INVENTAIRE[]= [];

  file: any;
  arrayBuffer: any | ArrayBuffer;
  worksheet: any[];
  editRow: number;
  phone: any;
  age: any;
  company: any;
  name: any;

  form: FormGroup = new FormGroup({
    file_excel: new FormControl(''),
  });

  constructor() { }

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
      { key: 'action',              title: 'ACTIONS' ,              cellTemplate: this.actionTpl, searchEnabled: false },
     
      { key: 'n_inventaire',        title: 'N° INVENTAIRE',         cellTemplate: this.n_inventaireTp},
      { key: 'n_serie',             title: 'N° SERIE',              cellTemplate: this.n_serieTp},
      { key: 'etat',                title: 'ETAT',                  cellTemplate: this.etatTp},
      { key: 'nom_agent',           title: 'NOM DE L\'AGENT',       cellTemplate: this.nom_agentTp},
      { key: 'observations',        title: 'OBSERVATIONS',          cellTemplate: this.observationsTp},
      { key: 'date_inventaire',     title: 'DATE INVENTAIRE',       cellTemplate: this.date_inventaireTp},


      { key: 'code_guichet',         title: 'CODE GUICHET',         cellTemplate: this.code_guichetTp},
      { key: 'departement',          title: 'DEPARTEMENT',          cellTemplate: this.departementTp },
      { key: 'direction',            title: 'DIRECTION',            cellTemplate: this.directionTp },
      { key: 'famille',              title: 'FAMILLE',              cellTemplate: this.familleTp },
      { key: 'libelle_famille',      title: 'LIBELLE FAMILLE',      cellTemplate: this.libelle_familleTp },
      { key: 'libelle_famille_1',    title: 'LIBELLE FAMILLE 1',    cellTemplate: this.libelle_famille_1Tp},
      { key: 'niveau',               title: 'NIVEAU',               cellTemplate: this.niveauTp },
      { key: 'service',              title: 'SERVICE',              cellTemplate: this.serviceTp },
      { key: 'sous_famille',         title: 'SOUS FAMILLE',         cellTemplate: this.sous_familleTp },
      { key: 'code_localisation',    title: 'code localisation',    cellTemplate: this.code_localisationTp },
      { key: 'libelle_agence',       title: 'libelle agence ',      cellTemplate: this.libelle_agenceTp },
      { key: 'libelle_localisation', title: 'libelle localisation', cellTemplate: this.libelle_localisationTp },
    ];
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
      const updatedLine: IMMOBILIER = {
        code_guichet: worksheetLine['CODE GUICHET'],
        famille: worksheetLine['FAMILLE '],
        sous_famille: worksheetLine['SOUS FAMILLE'],
        libelle_famille: worksheetLine['LIBELLE FAMILLE'],
        libelle_famille_1: worksheetLine['LIBELLE FAMILLE_1'],
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
            code_localisation: this.code_localisation.nativeElement.value,
            direction: this.direction.nativeElement.value,
            departement: this.departement.nativeElement.value,
            libelle_agence: this.libelle_agence.nativeElement.value,
            niveau: this.niveau.nativeElement.value,
            libelle_localisation: this.libelle_localisation.nativeElement.value,
          } as INVENTAIRE;
        }
        return obj;
      }),
    ] as INVENTAIRE[];
    this.editRow = -1;
  }

}
