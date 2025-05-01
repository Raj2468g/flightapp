import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { AuthGuard } from './guards/auth.guard';
import { BookTicketComponent } from './components/user/book-ticket/book-ticket.component';
import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
import { ManageTicketsComponent } from './components/admin/manage-tickets/manage-tickets.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user/dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'manage-flights', pathMatch: 'full' },
      { path: 'manage-flights', component: ManageFlightsComponent },
      { path: 'manage-tickets', component: ManageTicketsComponent },
      { path: 'manage-users', component: ManageUsersComponent }
    ]
  },
  { path: 'book-ticket/:flightId', component: BookTicketComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }