import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { OurWorksComponent } from './pages/our-works/our-works.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LogoComponent } from './components/logo/logo.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';
import { ClientReviewComponent } from './pages/client-review/client-review.component';
import { RecentProjectsComponent } from './pages/recent-projects/recent-projects.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    HomeComponent,
    ServicesComponent,
    OurWorksComponent,
    AboutUsComponent,
    ContactUsComponent,
    AdminComponent,
    LogoComponent,
    BlogComponent,
    LoginComponent,
    ToastContainerComponent,
    ClientReviewComponent,
    RecentProjectsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Standalone loader component so it can be used in templates
    LoaderComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



