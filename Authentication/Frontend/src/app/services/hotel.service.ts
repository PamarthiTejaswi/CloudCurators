import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel, CreateHotelRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly API_URL = '/api/Admin/hotels';

  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.API_URL);
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.API_URL}/${id}`);
  }

  createHotel(hotel: CreateHotelRequest): Observable<Hotel> {
    const { ...payload } = hotel as any;
    delete (payload as any).id;
    return this.http.post<Hotel>('/api/Admin/hotel', payload);
  }

  updateHotel(id: number, hotel: Partial<CreateHotelRequest>): Observable<Hotel> {
    return this.http.put<Hotel>(`/api/Admin/hotel/${id}`, { id, ...hotel });
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`/api/Admin/hotel/${id}`);
  }

  searchHotels(query: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.API_URL}?q=${encodeURIComponent(query)}`);
  }
}
