import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
import { ManageBookingsComponent } from './components/admin/manage-bookings/manage-bookings.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { BookTicketComponent } from './components/user/book-ticket/book-ticket.component';
import { ViewFlightsComponent } from './components/user/view-flights/view-flights.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { UserNavComponent } from './components/user/user-nav/user-nav.component';
import { routes } from './app.routes'; // Import routes from app.routes.ts

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes), // Use routes from app.routes.ts
    AdminLoginComponent,
    UserLoginComponent,
    AdminDashboardComponent,
    ManageFlightsComponent,
    ManageBookingsComponent,
    UserDashboardComponent,
    BookTicketComponent,
    ViewFlightsComponent,
    AdminNavComponent,
    RegistrationComponent,
    UserNavComponent
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }