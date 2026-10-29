#!/usr/bin/env bash
# Reference answer for angular-select, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
mkdir -p src/app
cat > src/app/country-form.component.ts <<'EOF'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BqSelect, SelectValueAccessor } from '@beeq/angular/standalone';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [ReactiveFormsModule, BqSelect, SelectValueAccessor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './country-form.component.html',
})
export class CountryFormComponent {
  readonly form = new FormGroup({
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get countryInvalid() {
    const control = this.form.controls.country;
    return control.invalid && control.touched;
  }
}
EOF
cat > src/app/country-form.component.html <<'EOF'
<form [formGroup]="form">
  <bq-select
    formControlName="country"
    placeholder="Choose a country"
    required
    disable-search
    [validationStatus]="countryInvalid ? 'error' : 'none'"
  >
    <label slot="label">Country</label>
    <bq-option value="ro">Romania</bq-option>
    <bq-option value="es">Spain</bq-option>
    <bq-option value="md">Moldova</bq-option>
    <bq-option value="gb">United Kingdom</bq-option>
    <bq-option value="de">Germany</bq-option>
    @if (countryInvalid) {
      <span slot="helper-text">Choose a country.</span>
    }
  </bq-select>
</form>
EOF
rm -- "$0"
