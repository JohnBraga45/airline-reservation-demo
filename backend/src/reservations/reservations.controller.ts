import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import type { Reservation } from './reservations.service';

class CreateReservationDto {
  flightId!: number;
  passengerName!: string;
}

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto): Reservation {
    return this.reservationsService.create(dto.flightId, dto.passengerName);
  }

  @Get()
  getAll(): Reservation[] {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Reservation {
    return this.reservationsService.findOne(id);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.cancel(id);
  }
}