import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { MapsComponent }            from '../../pages/maps/maps.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportExcelFileComponent } from 'app/pages/import-excel-file/import-excel-file.component';
import { TableModule } from 'ngx-easy-table';
import { InventaireComponent } from 'app/pages/inventaire/inventaire.component';
import { ListMeubleComponent } from 'app/pages/list-meuble/list-meuble.component';
import { PeriodeInventaireComponent } from 'app/pages/periode-inventaire/periode-inventaire.component';
import { UsersComponent } from 'app/pages/users/users.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TableModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    ImportExcelFileComponent,
    InventaireComponent,
    ListMeubleComponent,
    PeriodeInventaireComponent,
    UsersComponent  
  ]
})

export class AdminLayoutModule {}
