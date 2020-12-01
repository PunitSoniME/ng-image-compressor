import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonateRoutingModule } from './donate-routing.module';
import { DonateComponent } from './donate.component';
import { HeaderModule } from '../components/header/header.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DonateComponent],
  imports: [
  CommonModule,
    HeaderModule,
    FormsModule,
    DonateRoutingModule
  ]
})
export class DonateModule { }
