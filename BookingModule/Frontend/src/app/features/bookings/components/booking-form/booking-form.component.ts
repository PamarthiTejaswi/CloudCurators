import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BookingFormModel } from '../../models/booking-form.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isSubmitting = false;

  @Output() submitBooking = new EventEmitter<BookingFormModel>();

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitBooking.emit(this.form.getRawValue() as BookingFormModel);
  }
}
