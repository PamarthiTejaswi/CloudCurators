export interface Room {
  id: number;
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  totalRooms: number;
  maxGuests: number;
}

export interface CreateRoomRequest {
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  totalRooms: number;
  maxGuests: number;
}

export interface UpdateRoomRequest {
  id?: number;
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  totalRooms: number;
  maxGuests: number;
}
