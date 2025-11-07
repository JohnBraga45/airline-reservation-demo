# Sistema de Reserva de Voo — Demo Full‑Stack

Aplicação web fictícia para reservas de voo, construída com frontend React (Vite + TypeScript) e backend NestJS (Node.js). O projeto inclui testes automatizados de UI (Playwright) e API (Postman + Newman), além de pipeline CI em GitHub Actions.

## Tecnologias
- Frontend: React + Vite + TypeScript
- Backend: NestJS (Node.js)
- Testes UI: Playwright
- Testes API: Postman + Newman
- CI/CD: GitHub Actions

## Arquitetura e Fluxo
- `GET /flights`: lista voos disponíveis (dados em memória)
- `GET /flights/:id`: consulta um voo específico
- `POST /reservations`: cria uma reserva (valida assentos e decrementa)
- `GET /reservations/:id`: consulta uma reserva
- `DELETE /reservations/:id`: cancela a reserva e restaura assento

Integração:
- O frontend consome a API via `fetch`. A URL é configurável por `VITE_API_URL` (fallback: `http://localhost:3000`).
- CORS habilitado no backend para `http://localhost:5173` (dev local do Vite).

## Como rodar localmente
Pré‑requisitos: Node.js 18+ (ou 20), npm.

### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
# Servidor em http://localhost:3000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
# opcional: definir API
# PowerShell (Windows):
# $env:VITE_API_URL = "http://localhost:3000"
# Bash:
# export VITE_API_URL="http://localhost:3000"
npm run dev
# Aplicação em http://localhost:5173
```

## Testes Automatizados
### UI (Playwright)
Pré‑requisito: backend rodando em `http://localhost:3000`.
```bash
cd frontend
npm install
npx playwright install
npx playwright test
```
- Configuração: `frontend/playwright.config.ts` (usa `npm run preview` e `baseURL` `http://localhost:5173`).
- Caso queira rodar localmente com servidor dev, use `npm run dev` e ajuste `webServer` conforme preferir.

### API (Postman + Newman)
```bash
# na raiz do projeto
npx newman run tests/api/SistemaDeVoo.postman_collection.json \
  -e tests/api/SistemaDeVoo.postman_environment.json
```
- Fluxo coberto: listar voos, criar reserva, consultar, cancelar, validar assentos restaurados.

## CI/CD (GitHub Actions)
Workflow em `.github/workflows/ci.yml` com dois jobs:
- `backend_api`: instala/compila backend, sobe servidor e valida a coleção em Newman.
- `frontend_ui`: instala deps do frontend e browsers do Playwright, sobe backend e roda testes de UI.

## Endpoints (exemplos)
```bash
# Listar voos
curl http://localhost:3000/flights

# Consultar voo 1
curl http://localhost:3000/flights/1

# Criar reserva
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{"flightId":1, "passengerName":"Fulano"}'

# Consultar reserva 1
curl http://localhost:3000/reservations/1

# Cancelar reserva 1
curl -X DELETE http://localhost:3000/reservations/1
```

## Estrutura de Pastas
```
.
├── backend/                # NestJS API
│   └── src/
│       ├── flights/        # módulo de voos
│       └── reservations/   # módulo de reservas
├── frontend/               # React + Vite
│   ├── src/App.tsx         # lista voos e fluxo de reserva
│   └── tests/              # testes Playwright
├── tests/api/              # coleção Postman + ambiente
└── .github/workflows/ci.yml# pipeline CI
```

## Configuração e Variáveis
- Frontend: `VITE_API_URL` define o endpoint da API (padrão `http://localhost:3000`).
- Backend: CORS liberado para `http://localhost:5173`.

## Decisões e Limitações
- Persistência em memória (apenas demonstração). Ao reiniciar a API, reservas e contadores resetam.
- Para produção, trocar para banco (SQLite/PostgreSQL) usando ORM (TypeORM/Prisma) e adicionar autenticação (JWT), logs e observabilidade.

## Próximas melhorias 
- Persistência com banco e migrações (SQLite/Postgres + TypeORM).
- Autenticação e perfis (passageiro/admin).
- Validações de negócio (limites, regras por rota/data).
- Testes mais abrangentes (erros, concorrência, carga).
- Deploy (Docker + Render/Vercel + Railway/Hobby).