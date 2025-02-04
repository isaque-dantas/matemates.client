import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {RegisterComponent} from "./components/pages/register/register.component";
import {ImageTestComponent} from "./components/pages/image-test/image-test.component";
import {ProfileComponent} from "./components/pages/profile/profile.component";
import {authGuard} from "./auth/auth.guard";
import {EntryViewComponent} from "./components/pages/entry-view/entry-view.component";
import {EntryFormComponent} from "./components/pages/entry-form/entry-form.component";
import {staffOnlyGuard} from "./auth/staff-only.guard";

export const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'test-image', component: ImageTestComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'entry/:id', component: EntryViewComponent},
  {path: 'create_entry', component: EntryFormComponent, canActivate: [authGuard, staffOnlyGuard]},
  {path: 'edit_entry/:id', component: EntryFormComponent, canActivate: [authGuard, staffOnlyGuard]}
];
