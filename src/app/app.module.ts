import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
// import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { NouisliderModule } from 'ng2-nouislider';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    NouisliderModule,
    // IonRangeSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
