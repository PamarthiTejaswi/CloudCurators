import { AbstractControl, ValidationErrors } from '@angular/forms';

export function bookingDateValidator(control: AbstractControl): ValidationErrors | null {
  const fromDate = control.get('fromDate')?.value;
  const toDate = control.get('toDate')?.value;

  if (!fromDate || !toDate) {
    return null;
  }

  return new Date(toDate) > new Date(fromDate) ? null : { invalidDateRange: true };
}
