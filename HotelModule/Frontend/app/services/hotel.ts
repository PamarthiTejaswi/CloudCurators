import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id?: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {

private apiUrl = 'http://localhost:5221/api/Hotel';  

  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  createHotel(hotel: Hotel) {
    return this.http.post(this.apiUrl, hotel);
  }

  deleteHotel(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchHotels(query?: string) {
  return this.http.get<Hotel[]>(
    `${this.apiUrl}/search?query=${query}`
  );
}
}