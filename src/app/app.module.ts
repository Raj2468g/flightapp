import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { BookTicketComponent } from './components/user/book-ticket/book-ticket.component';
import { ManageFlightsComponent } from './components/admin/manage-flights/manage-flights.component';
import { ManageTicketsComponent } from './components/admin/manage-tickets/manage-tickets.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NavBarComponent } from './components/nav-bar/nav-bar/nav-bar.component';
@NgModule({
  declarations: [
    AppComponent,
 
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UserLoginComponent,
    AdminLoginComponent,
    FormsModule,
    AppRoutingModule,
    AdminDashboardComponent,
    RegistrationComponent,
    BookTicketComponent,
    ManageFlightsComponent,
    ManageTicketsComponent,
    ManageUsersComponent,
    HomeComponent,
    AboutComponent,
    NavBarComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }