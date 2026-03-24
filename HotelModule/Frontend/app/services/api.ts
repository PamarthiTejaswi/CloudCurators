import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }
}