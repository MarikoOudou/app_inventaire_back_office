import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    // { path: '/dashboard',           title: 'Dashboard',            icon:'nc-bank',       class: '' },
    { path: '/importation',         title: 'Importation',          icon:'nc-cloud-download-93',    class: '' },
    { path: '/codification',        title: 'Codification',         icon:'nc-diamond',    class: '' },
    { path: '/periode-inventaire',  title: 'Période Inventaire',   icon:'nc-calendar-60',    class: '' },
    { path: '/inventaire',          title: 'Inventaire',           icon:'nc-diamond',    class: '' },
    { path: '/users',               title: 'Utilisateur',          icon:'nc-circle-10',    class: '' },

    // { path: '/icons',         title: 'Icons',              icon:'nc-pin-3',      class: '' },
    // { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
    // { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
    // { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '' },
    // { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' },
    { path: '/upgrade',       title: 'Télécharger',    icon:'nc-spaceship',  class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
