import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    UserLoginComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    ViewTicketsComponent,
    BookTicketComponent,
    UpdateProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ManageFlightsComponent,
    ManageBookingsComponent,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }