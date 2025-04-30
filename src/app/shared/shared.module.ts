import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCumpComponent } from './components/bread-cump/bread-cump.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BreadCumpComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BreadCumpComponent
  ]
})
export class SharedModule { }
