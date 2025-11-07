import { useEffect, useState } from 'react'
import './App.css'

type Flight = {
  id: number
  origin: string
  destination: string
  date: string
  seatsAvailable: number
}

type Reservation = {
  id: number
  flightId: number
  passengerName: string
  createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengerName, setPassengerName] = useState('')
  const [reservation, setReservation] = useState<Reservation | null>(null)

  const loadFlights = async () => {
    const res = await fetch(`${API_URL}/flights`)
    if (!res.ok) throw new Error('Falha ao carregar voos')
    const data: Flight[] = await res.json()
    setFlights(data)
  }

  const loadReservations = async () => {
    const res = await fetch(`${API_URL}/reservations`)
    if (!res.ok) throw new Error('Falha ao carregar reservas')
    const data: Reservation[] = await res.json()
    setReservations(data)
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadFlights()
        await loadReservations()
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const reserve = async () => {
    if (!selectedFlight) return
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: selectedFlight.id, passengerName }),
      })
      if (!res.ok) throw new Error('Não foi possível reservar')
      const data: Reservation = await res.json()
      setReservation(data)
      await loadFlights()
      await loadReservations()
      setSelectedFlight(null)
      setPassengerName('')
    } catch (e: any) {
      alert(e.message)
    }
  }

  const cancelReservation = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao cancelar a reserva')
      await loadReservations()
      await loadFlights()
    } catch (e: any) {
      alert(e.message)
    }
  }

  if (loading) return <div className="container"><div className="card">Carregando dados...</div></div>
  if (error) return <div className="container"><div className="card" style={{ color: 'red' }}>Erro: {error}</div></div>

  return (
    <>
      <header className="app-header">
        <div className="brand">Sistema de Reserva de Voo</div>
        <nav className="nav">
          <div className="nav-links">
            <a href="#voos">Voos</a>
            <a href="#reservas">Reservas</a>
            <a href="#">Ajuda</a>
          </div>
          <button className="btn btn-cta">Check-in</button>
        </nav>
      </header>

      <main className="container">
        <section className="hero card">
          <h1 className="hero-title">Viaje com conforto e segurança</h1>
          <p className="hero-subtitle">Encontre o voo ideal e reserve em poucos cliques.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#voos">Ver voos disponíveis</a>
          </div>
        </section>

        <section className="card" id="voos">
          <h2 className="section-title">Voos Disponíveis</h2>
          <p className="subtitle">Selecione um voo e faça sua reserva.</p>

          {reservation && (
            <div className="alert alert-success">
              Reserva confirmada! ID: {reservation.id} | Passageiro: {reservation.passengerName} | Voo: {reservation.flightId}
            </div>
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Voo</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Data</th>
                <th className="numeric">Assentos</th>
                <th className="numeric">Ações</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id}>
                  <td>#{f.id}</td>
                  <td>{f.origin}</td>
                  <td>{f.destination}</td>
                  <td>{new Date(f.date).toLocaleString()}</td>
                  <td className="numeric">
                    {f.seatsAvailable}
                    {f.seatsAvailable > 0 ? (
                      <span style={{ marginLeft: 8 }} className="badge badge-success">Disponível</span>
                    ) : (
                      <span style={{ marginLeft: 8 }} className="badge badge-danger">Lotado</span>
                    )}
                  </td>
                  <td className="numeric">
                    <button className="btn btn-primary" disabled={f.seatsAvailable <= 0} onClick={() => setSelectedFlight(f)}>
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedFlight && (
            <div style={{ marginTop: 16 }}>
              <h3 className="section-title">Reservar voo #{selectedFlight.id}</h3>
              <div className="form-row">
                <input
                  className="input"
                  placeholder="Nome do passageiro"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={reserve} disabled={!passengerName.trim()}>
                  Confirmar reserva
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedFlight(null)}>
                  Cancelar
                </button>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>Preencha o nome do passageiro para confirmar.</p>
            </div>
          )}
        </section>

        <section className="card" id="reservas">
          <h2 className="section-title">Minhas Reservas</h2>
          <p className="subtitle">Consulte e cancele reservas quando necessário.</p>

          <table className="table">
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Passageiro</th>
                <th>Voo</th>
                <th>Criada em</th>
                <th className="numeric">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">Nenhuma reserva encontrada</td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.passengerName}</td>
                    <td>#{r.flightId}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="numeric">
                      <button className="btn btn-secondary" onClick={() => cancelReservation(r.id)}>Cancelar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="muted">© 2025 Sistema de Voo — Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  )
}

export default App
