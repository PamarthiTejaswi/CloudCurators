import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../services/hotel';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule],  // ✅ FIX
  templateUrl: './hotel-card.html'
})

export class HotelCardComponent {

  @Input() hotel!: Hotel;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.hotel.id!);
  }
}