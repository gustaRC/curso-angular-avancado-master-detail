import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class=text-danger>
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    }

    return null;
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  getErrorMessage(): string | null {
    if (this.formControl.errors.required) {
      return 'dado obrigatório';
    }

    if (this.formControl.errors.minlength) {
      return `deve ter no mínimo ${this.formControl.errors.minlength.requiredLength} caracteres`;
    }

    if (this.formControl.errors.maxlength) {
      return `deve ter no máximo ${this.formControl.errors.maxlength.requiredLength} caracteres`;
    }

    return null;
  }
}


