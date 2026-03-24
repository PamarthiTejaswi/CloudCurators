import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, AuthService, NotificationService } from '../../../services';
import { Hotel } from '../../../models';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-hotels-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './hotels-list.component.html',
  styleUrls: ['./hotels-list.component.css']
})
export class HotelsListComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  filteredHotels = signal<Hotel[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedHotel = signal<Hotel | null>(null);
  showDetails = signal(false);

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  get searchQueryValue(): string {
    return this.searchQuery();
  }

  set searchQueryValue(value: string) {
    this.searchQuery.set(value);
  }

  encodeUri(value: string): string {
    return encodeURI(value);
  }

  getLocation(hotel: Hotel): string {
    return hotel.location || '';
  }

  getAmenities(hotel: Hotel): string[] {
    if (!hotel.amenities) return [];
    return hotel.amenities.split(',').map(a => a.trim()).filter(Boolean);
  }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading.set(true);
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels.set(data);
        this.filteredHotels.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error('Failed to load hotels');
        console.error(error);
      }
    });
  }

  searchHotels(): void {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredHotels.set(this.hotels());
      return;
    }

    const filtered = this.hotels().filter(hotel =>
      hotel.name.toLowerCase().includes(query) ||
      hotel.location.toLowerCase().includes(query)
    );
    this.filteredHotels.set(filtered);
  }

  viewHotelDetails(hotel: Hotel): void {
    this.selectedHotel.set(hotel);
    this.showDetails.set(true);
  }

  closeDetails(): void {
    this.showDetails.set(false);
    this.selectedHotel.set(null);
  }

  bookHotel(hotel: Hotel): void {
    this.notificationService.info('Booking feature coming soon!');
  }

  getCurrentUser() {
    return this.authService.currentUser();
  }
}

