import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompressRoutingModule } from './compress-routing.module';
import { CompressComponent } from './compress.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { HeaderModule } from '../components/header/header.module';
import { NgbProgressbarModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [CompressComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
    CompressRoutingModule,
    HeaderModule,
    NgbProgressbarModule,
    NgbToastModule
  ],
  providers: []
})
export class CompressModule { }
