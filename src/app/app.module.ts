import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { fakeBackendProvider } from './_helpers';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AlertComponent } from './_directives';
import { AlertService, UserService } from './_services';
import { RegisterComponent } from './register';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        RegisterComponent
    ],
    providers: [
        AlertService,
        UserService,
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
