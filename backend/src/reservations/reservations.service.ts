import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FlightsService } from '../flights/flights.service';

export interface Reservation {
  id: number;
  flightId: number;
  passengerName: string;
  createdAt: string; // ISO
}

@Injectable()
export class ReservationsService {
  private reservations: Reservation[] = [];
  private seq = 1;

  constructor(private readonly flightsService: FlightsService) {}

  create(flightId: number, passengerName: string): Reservation {
    try {
      this.flightsService.decrementSeat(flightId);
    } catch (e) {
      throw new BadRequestException('Não foi possível reservar: ' + (e as Error).message);
    }
    const reservation: Reservation = {
      id: this.seq++,
      flightId,
      passengerName,
      createdAt: new Date().toISOString(),
    };
    this.reservations.push(reservation);
    return reservation;
  }

  findAll(): Reservation[] {
    return this.reservations;
  }

  findOne(id: number): Reservation {
    const r = this.reservations.find((x) => x.id === id);
    if (!r) throw new NotFoundException('Reserva não encontrada');
    return r;
  }

  cancel(id: number): { cancelled: boolean } {
    const idx = this.reservations.findIndex((x) => x.id === id);
    if (idx === -1) throw new NotFoundException('Reserva não encontrada');
    const r = this.reservations[idx];
    this.reservations.splice(idx, 1);
    this.flightsService.incrementSeat(r.flightId);
    return { cancelled: true };
  }
}