import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompressComponent } from './compress.component';

const routes: Routes = [{ path: '', component: CompressComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompressRoutingModule { }
