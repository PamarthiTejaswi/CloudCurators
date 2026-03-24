import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HotelCardComponent } from './hotel-card';
import { Hotel } from '../../services/hotel';

describe('HotelCardComponent', () => {
  let component: HotelCardComponent;
  let fixture: ComponentFixture<HotelCardComponent>;

  const mockHotel: Hotel = {
    id: 1,
    name: 'Test Hotel',
    location: 'Test Location',
    description: 'Test Description',
    amenities: 'WiFi, Pool'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept hotel input', () => {
    component.hotel = mockHotel;
    fixture.detectChanges();
    expect(component.hotel).toEqual(mockHotel);
  });

  it('should emit delete event with hotel id when onDelete is called', fakeAsync(() => {
    component.hotel = mockHotel;
    let emittedId: number | undefined;

    component.delete.subscribe((hotelId: number) => {
      emittedId = hotelId;
    });

    component.onDelete();
    tick();
    expect(emittedId).toBe(mockHotel.id);
  }));

  it('should emit correct hotel id on delete', fakeAsync(() => {
    const testHotel: Hotel = { ...mockHotel, id: 42 };
    component.hotel = testHotel;
    let emittedId: number | undefined;

    component.delete.subscribe((hotelId: number) => {
      emittedId = hotelId;
    });

    component.onDelete();
    tick();
    expect(emittedId).toBe(42);
  }));
});
