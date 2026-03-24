export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
  image?: string;
  rating?: number;
  pricePerNight?: number;
  createdAt?: string;
}

export interface CreateHotelRequest {
  name: string;
  location: string;
  description: string;
  amenities: string;
}
