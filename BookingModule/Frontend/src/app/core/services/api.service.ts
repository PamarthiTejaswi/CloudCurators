import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }

  post<TRequest, TResponse>(path: string, payload: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(this.buildUrl(path), payload);
  }

  private buildUrl(path: string): string {
    return `${API_CONFIG.baseUrl}/${path}`;
  }
}
