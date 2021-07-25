import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PizzaListPageRoutingModule } from './pizza-list-routing.module';

import { PizzaListPage } from './pizza-list.page';
import { SharedModule } from '../../_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzaListPageRoutingModule,
    SharedModule
  ],
  declarations: [PizzaListPage]
})
export class PizzaListPageModule {}
