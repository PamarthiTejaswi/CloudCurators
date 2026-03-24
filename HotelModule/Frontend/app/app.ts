import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelListComponent } from './components/hotel-list/hotel-list';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HotelListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}  