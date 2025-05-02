// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ManageBookingsComponent } from './components/admin/manage-bookings/manage-bookings.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistrationComponent } from './components/user/registration/registration.component';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-bookings', component: ManageBookingsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-users', component: ManageUsersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-flights', component: ManageFlightsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }