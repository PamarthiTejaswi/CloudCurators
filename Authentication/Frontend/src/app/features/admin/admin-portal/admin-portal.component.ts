import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HotelService, RoomService, UserService, NotificationService } from '../../../services';
import { Hotel, Room, User, CreateHotelRequest, CreateRoomRequest, UpdateRoomRequest } from '../../../models';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

type TabType = 'hotels' | 'rooms' | 'users';

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent],
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {
  activeTab = signal<TabType>('hotels');
  
  // Hotels
  hotels = signal<Hotel[]>([]);
  hotelsLoading = signal(false);
  hotelForm: FormGroup;
  editingHotel = signal<Hotel | null>(null);
  showHotelForm = signal(false);

  // Rooms
  rooms = signal<Room[]>([]);
  roomsLoading = signal(false);
  roomForm: FormGroup;
  editingRoom = signal<Room | null>(null);
  showRoomForm = signal(false);
  selectedHotelForRooms = signal<number | null>(null);

  // Users
  users = signal<User[]>([]);
  usersLoading = signal(false);
  searchUserQuery = signal('');
  filteredUsers = signal<User[]>([]);

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private roomService: RoomService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.hotelForm = this.createHotelForm();
    this.roomForm = this.createRoomForm();
  }

  get selectedHotelForRoomsValue(): number | '' {
    return this.selectedHotelForRooms() ?? '';
  }

  set selectedHotelForRoomsValue(value: number | '') {
    this.selectedHotelForRooms.set(value === '' ? null : Number(value));
  }

  get searchUserQueryValue(): string {
    return this.searchUserQuery();
  }

  set searchUserQueryValue(value: string) {
    this.searchUserQuery.set(value);
  }

  ngOnInit(): void {
    this.loadHotels();
    this.loadUsers();
  }

  // ===== HOTEL METHODS =====
  createHotelForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      amenities: ['', Validators.required]
    });
  }

  loadHotels(): void {
    this.hotelsLoading.set(true);
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels.set(data);
        this.hotelsLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load hotels');
        this.hotelsLoading.set(false);
      }
    });
  }

  openHotelForm(hotel?: Hotel): void {
    if (hotel) {
      this.editingHotel.set(hotel);
      this.hotelForm.patchValue({
        ...hotel
      });
    } else {
      this.editingHotel.set(null);
      this.hotelForm.reset();
    }
    this.showHotelForm.set(true);
  }

  saveHotel(): void {
    if (this.hotelForm.invalid) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    const formValue = this.hotelForm.value;
    const request: CreateHotelRequest = { ...formValue };
    delete (request as any).id;

    if (this.editingHotel()) {
      const hotelId = Number(this.editingHotel()!.id);
      this.hotelService.updateHotel(hotelId, request).subscribe({
        next: () => {
          this.notificationService.success('Hotel updated successfully');
          this.showHotelForm.set(false);
          this.loadHotels();
        },
        error: () => this.notificationService.error('Failed to update hotel')
      });
    } else {
      this.hotelService.createHotel(request).subscribe({
        next: (created) => {
          this.notificationService.success('Hotel created successfully');
          this.showHotelForm.set(false);
          if (created) {
            this.hotels.set([created, ...this.hotels()]);
          } else {
            this.loadHotels();
          }
        },
        error: () => this.notificationService.error('Failed to create hotel')
      });
    }
  }

  deleteHotel(id: number | string): void {
    if (confirm('Are you sure you want to delete this hotel?')) {
      const hotelId = Number(id);
      this.hotelService.deleteHotel(hotelId).subscribe({
        next: () => {
          this.notificationService.success('Hotel deleted successfully');
          this.loadHotels();
        },
        error: () => this.notificationService.error('Failed to delete hotel')
      });
    }
  }

  // ===== ROOM METHODS =====
  createRoomForm(): FormGroup {
    return this.fb.group({
      hotelId: ['', Validators.required],
      roomType: ['', Validators.required],
      pricePerNight: ['', [Validators.required, Validators.min(0)]],
      totalRooms: ['', [Validators.required, Validators.min(1)]],
      maxGuests: ['', [Validators.required, Validators.min(1)]]
    });
  }

  loadRoomsForHotel(hotelId: number | null): void {
    if (!hotelId) {
      this.selectedHotelForRooms.set(null);
      this.rooms.set([]);
      this.roomsLoading.set(false);
      return;
    }
    this.roomsLoading.set(true);
    this.selectedHotelForRooms.set(hotelId);
    this.roomService.getRoomsByHotel(hotelId).subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.roomsLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load rooms');
        this.roomsLoading.set(false);
      }
    });
  }

  openRoomForm(room?: Room): void {
    if (room) {
      this.editingRoom.set(room);
      this.roomForm.patchValue({
        ...room
      });
    } else {
      this.editingRoom.set(null);
      this.roomForm.reset({ hotelId: this.selectedHotelForRooms() });
    }
    this.showRoomForm.set(true);
  }

  saveRoom(): void {
    if (this.roomForm.invalid) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    const raw = this.roomForm.value;
    const normalized = {
      ...raw,
      hotelId: Number(raw.hotelId),
      pricePerNight: Number(raw.pricePerNight),
      totalRooms: Number(raw.totalRooms),
      maxGuests: Number(raw.maxGuests)
    };

    if (this.editingRoom()) {
      const request: UpdateRoomRequest = { ...normalized };
      const roomId = Number(this.editingRoom()!.id);
      this.roomService.updateRoom(roomId, request).subscribe({
        next: () => {
          this.notificationService.success('Room updated successfully');
          this.showRoomForm.set(false);
          this.loadRoomsForHotel(this.selectedHotelForRooms()!);
        },
        error: () => this.notificationService.error('Failed to update room')
      });
    } else {
      const request: CreateRoomRequest = { ...normalized };
      this.roomService.createRoom(request).subscribe({
        next: () => {
          this.notificationService.success('Room created successfully');
          this.showRoomForm.set(false);
          this.loadRoomsForHotel(this.selectedHotelForRooms()!);
        },
        error: () => this.notificationService.error('Failed to create room')
      });
    }
  }

  deleteRoom(id: number | string): void {
    if (confirm('Are you sure you want to delete this room?')) {
      const roomId = Number(id);
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this.notificationService.success('Room deleted successfully');
          this.loadRoomsForHotel(this.selectedHotelForRooms()!);
        },
        error: () => this.notificationService.error('Failed to delete room')
      });
    }
  }

  // ===== USER METHODS =====
  loadUsers(): void {
    this.usersLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.filteredUsers.set(data);
        this.usersLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load users');
        this.usersLoading.set(false);
      }
    });
  }

  searchUsers(): void {
    const query = this.searchUserQuery().toLowerCase();
    const filtered = this.users().filter(user =>
      (user.name || '').toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    this.filteredUsers.set(filtered);
  }

  deleteUser(id: number | string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const userId = Number(id);
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.notificationService.success('User deleted successfully');
          this.loadUsers();
        },
        error: () => this.notificationService.error('Failed to delete user')
      });
    }
  }
}

