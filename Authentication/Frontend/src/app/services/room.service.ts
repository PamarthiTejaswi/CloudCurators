import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Room, CreateRoomRequest, UpdateRoomRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly API_URL = '/api/Admin/rooms';

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL).pipe(
      map(rooms => rooms.filter(room => room.hotelId === hotelId))
    );
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`/api/Admin/room/${id}`);
  }

  createRoom(room: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>('/api/Admin/room', room);
  }

  updateRoom(id: number, room: UpdateRoomRequest): Observable<Room> {
    return this.http.put<Room>(`/api/Admin/room/${id}`, { id, ...room });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`/api/Admin/room/${id}`);
  }

  getAvailableRooms(hotelId: number): Observable<Room[]> {
    return this.getRoomsByHotel(hotelId);
  }
}
