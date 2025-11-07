import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FlightsService } from './flights.service';
import type { Flight } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  getAll(): Flight[] {
    return this.flightsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Flight {
    return this.flightsService.findOne(id);
  }
}