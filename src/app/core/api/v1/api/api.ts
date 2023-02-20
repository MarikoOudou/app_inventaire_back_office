export * from './codification.service';
import { CodificationService } from './codification.service';
export * from './inventaire.service';
import { InventaireService } from './inventaire.service';
export * from './periodeInventaire.service';
import { PeriodeInventaireService } from './periodeInventaire.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [CodificationService, InventaireService, PeriodeInventaireService, UsersService];
