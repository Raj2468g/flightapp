import { NgModule } from '@angular/core';
     import { RouterModule, Routes } from '@angular/router';
     import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
     import { UserLoginComponent } from './components/login/user-login/user-login.component';
     import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
     import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
     import { ManageBookingsComponent } from './components/admin/manage-bookings/manage-bookings.component';
     import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
     import { BookTicketComponent } from './components/user/book-ticket/book-ticket.component';
     import { ViewTicketsComponent } from './components/user/view-tickets/view-tickets.component';
     import { UpdateProfileComponent } from './components/user/update-profile/update-profile.component';
     import { AuthGuard } from './guards/auth.guard';

     const routes: Routes = [
       { path: '', redirectTo: '/user-login', pathMatch: 'full' },
       { path: 'admin-login', component: AdminLoginComponent },
       { path: 'user-login', component: UserLoginComponent },
       {
         path: 'admin',
         canActivate: [AuthGuard],
         data: { role: 'admin' },
         children: [
           { path: 'dashboard', component: AdminDashboardComponent },
           { path: 'flights', component: ManageFlightsComponent },
           { path: 'bookings', component: ManageBookingsComponent }
         ]
       },
       {
         path: 'user',
         canActivate: [AuthGuard],
         data: { role: 'user' },
         children: [
           { path: 'dashboard', component: UserDashboardComponent },
           { path: 'book', component: BookTicketComponent },
           { path: 'tickets', component: ViewTicketsComponent },
           { path: 'profile', component: UpdateProfileComponent }
         ]
       },
       { path: '**', redirectTo: '/user-login' }
     ];

     @NgModule({
       imports: [RouterModule.forRoot(routes)],
       exports: [RouterModule]
     })
     export class AppRoutingModule { }