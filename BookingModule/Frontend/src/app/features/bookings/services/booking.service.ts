import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { API_CONFIG } from '../../../core/config/api.config';
import { CreateBookingDto } from '../models/create-booking.dto';
import { BookingResponseDto } from '../models/booking-response.dto';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  createBooking(payload: CreateBookingDto): Observable<BookingResponseDto> {
    return this.api.post<CreateBookingDto, BookingResponseDto>(
      API_CONFIG.endpoints.bookings,
      payload,
    );
  }
}
