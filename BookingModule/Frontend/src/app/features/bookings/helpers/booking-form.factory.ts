import { FormControl, FormGroup, Validators } from '@angular/forms';

export function createBookingForm(): FormGroup {
  return new FormGroup({
    roomId: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    pricePerNight: new FormControl(4200, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    fromDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    toDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}
