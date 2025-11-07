import { Injectable, NotFoundException } from '@nestjs/common';

export interface Flight {
  id: number;
  origin: string;
  destination: string;
  date: string; // ISO date string
  seatsAvailable: number;
}

@Injectable()
export class FlightsService {
  private flights: Flight[] = [
    { id: 1, origin: 'São Paulo (GRU)', destination: 'Rio de Janeiro (GIG)', date: '2025-12-01T10:00:00Z', seatsAvailable: 5 },
    { id: 2, origin: 'Belo Horizonte (CNF)', destination: 'Salvador (SSA)', date: '2025-12-02T14:00:00Z', seatsAvailable: 3 },
    { id: 3, origin: 'Curitiba (CWB)', destination: 'Florianópolis (FLN)', date: '2025-12-03T09:30:00Z', seatsAvailable: 2 },
    // Europa
    { id: 4, origin: 'Lisboa (LIS)', destination: 'Madrid (MAD)', date: '2025-12-04T08:00:00Z', seatsAvailable: 6 },
    { id: 5, origin: 'Barcelona (BCN)', destination: 'Paris (CDG)', date: '2025-12-05T12:15:00Z', seatsAvailable: 4 },
    { id: 6, origin: 'Londres (LHR)', destination: 'Roma (FCO)', date: '2025-12-06T07:45:00Z', seatsAvailable: 5 },
    { id: 7, origin: 'Berlim (BER)', destination: 'Amesterdão (AMS)', date: '2025-12-07T16:30:00Z', seatsAvailable: 3 },
    { id: 8, origin: 'Zurique (ZRH)', destination: 'Viena (VIE)', date: '2025-12-08T10:50:00Z', seatsAvailable: 2 },
    { id: 9, origin: 'Paris (ORY)', destination: 'Londres (LGW)', date: '2025-12-09T13:20:00Z', seatsAvailable: 7 },
    { id: 10, origin: 'Porto (OPO)', destination: 'Genebra (GVA)', date: '2025-12-10T09:10:00Z', seatsAvailable: 4 },
  ];

  findAll(): Flight[] {
    return this.flights;
  }

  findOne(id: number): Flight {
    const flight = this.flights.find((f) => f.id === id);
    if (!flight) {
      throw new NotFoundException('Voo não encontrado');
    }
    return flight;
  }

  decrementSeat(id: number): Flight {
    const flight = this.findOne(id);
    if (flight.seatsAvailable <= 0) {
      throw new NotFoundException('Sem assentos disponíveis');
    }
    flight.seatsAvailable -= 1;
    return flight;
  }

  incrementSeat(id: number): Flight {
    const flight = this.findOne(id);
    flight.seatsAvailable += 1;
    return flight;
  }
}