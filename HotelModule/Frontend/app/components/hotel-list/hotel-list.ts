import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '../../services/hotel';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './hotel-list.html',
  styleUrl: './hotel-list.css'
})
export class HotelListComponent implements OnInit {

  hotels: Hotel[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  searchQuery: string = '';

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.isLoading = true;
    this.errorMessage = '';
    this.hotelService.getHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load hotels. Please check if the API is running.';
        this.isLoading = false;
        console.error('Error loading hotels:', error);
      }
    });
  }

  search() {
    if (!this.searchQuery.trim()) {
      this.loadHotels();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.hotelService
      .searchHotels(this.searchQuery)
      .subscribe({
        next: (data: Hotel[]) => {
          this.hotels = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Search failed. Please try again.';
          this.isLoading = false;
          console.error('Error searching hotels:', error);
        }
      });
  }

  deleteHotel(id: number) {
    this.hotelService.deleteHotel(id).subscribe({
      next: () => {
        this.loadHotels();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to delete hotel. Please try again.';
        console.error('Error deleting hotel:', error);
      }
    });
  }
}