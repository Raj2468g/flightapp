import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ManageBookingsComponent } from './components/admin/manage-bookings/manage-bookings.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
import { BookTicketComponent } from './components/user/book-ticket/book-ticket.component';
import { ViewFlightsComponent } from './components/user/view-flights/view-flights.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'user/book-ticket', component: BookTicketComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'user/flights', component: ViewFlightsComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-bookings', component: ManageBookingsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-users', component: ManageUsersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/manage-flights', component: ManageFlightsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];