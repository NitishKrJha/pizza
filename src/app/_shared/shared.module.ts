import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeadersComponent } from './../components/headers/headers.component';
import { FootersComponent } from './../components/footers/footers.component';


@NgModule({
  declarations: [FootersComponent, HeadersComponent],
  imports: [
    IonicModule.forRoot(),
    CommonModule
  ],
  exports: [
    FootersComponent,
    HeadersComponent
  ]
})
export class SharedModule { }
