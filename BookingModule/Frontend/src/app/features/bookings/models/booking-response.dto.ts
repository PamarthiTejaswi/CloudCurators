export interface BookingResponseDto {
  bookingId: number;
  roomId: number;
  totalAmount: number;
  fromDate: string;
  toDate: string;
  status: string;
}
