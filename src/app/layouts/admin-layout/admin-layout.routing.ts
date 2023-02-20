import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { ImportExcelFileComponent } from 'app/pages/import-excel-file/import-excel-file.component';
import { InventaireComponent } from 'app/pages/inventaire/inventaire.component';
import { ListMeubleComponent } from 'app/pages/list-meuble/list-meuble.component';
import { PeriodeInventaireComponent } from 'app/pages/periode-inventaire/periode-inventaire.component';
import { UsersComponent } from 'app/pages/users/users.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',            component: DashboardComponent },
    { path: 'user',                 component: UserComponent },
    { path: 'users',                 component: UsersComponent },

    { path: 'importation',          component: ImportExcelFileComponent },
    { path: 'inventaire',           component: InventaireComponent },
    { path: 'codification',         component: ListMeubleComponent },
    { path: 'periode-inventaire',   component: PeriodeInventaireComponent },

    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent }
];
