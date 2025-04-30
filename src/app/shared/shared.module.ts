import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCumpComponent } from './components/bread-cump/bread-cump.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';

@NgModule({
  declarations: [BreadCumpComponent, PageHeaderComponent, FormFieldErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BreadCumpComponent,
    PageHeaderComponent,
    FormFieldErrorComponent
  ]
})
export class SharedModule { }
