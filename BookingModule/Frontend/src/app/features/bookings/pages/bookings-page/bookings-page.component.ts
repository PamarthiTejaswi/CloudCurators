import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { createBookingForm } from '../../helpers/booking-form.factory';
import { BookingFormModel } from '../../models/booking-form.model';
import { BookingResponseDto } from '../../models/booking-response.dto';
import { bookingDateValidator } from '../../validators/booking-date.validator';
import { BookingService } from '../../services/booking.service';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookingFormComponent],
  templateUrl: './bookings-page.component.html',
  styleUrl: './bookings-page.component.css',
})
export class BookingsPageComponent {
  private readonly bookingService = inject(BookingService);

  protected readonly form: FormGroup = createBookingForm();
  protected readonly createdBooking = signal<BookingResponseDto | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly showBookingDetails = signal(false);
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.form.addValidators(bookingDateValidator);
  }

  protected submitBooking(formValue: BookingFormModel): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    const payload = {
      roomId: formValue.roomId,
      pricePerNight: formValue.pricePerNight,
      fromDate: new Date(formValue.fromDate).toISOString(),
      toDate: new Date(formValue.toDate).toISOString(),
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.createdBooking.set(booking);
        this.showBookingDetails.set(false);
        this.form.reset({
          roomId: 1,
          pricePerNight: 4200,
          fromDate: '',
          toDate: '',
        });
      },
      error: (error) => {
        this.createdBooking.set(null);
        this.showBookingDetails.set(false);
        this.errorMessage.set(
          error?.error?.message ||
            error?.message ||
            'Booking was not saved. Please check the backend API and database configuration.',
        );
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  protected toggleBookingDetails(): void {
    this.showBookingDetails.update((value) => !value);
  }
}
