import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCumpComponent } from './components/bread-cump/bread-cump.component';

@NgModule({
  declarations: [BreadCumpComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    BreadCumpComponent
  ]
})
export class SharedModule { }
