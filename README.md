# Trip Search and Booking

## Setup Instructions

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file:

```bash
cp .env.example apps/web/.env
```

3. Start PostgreSQL:

```bash
pnpm run db:start
```

4. Run the database migrations:

```bash
pnpm run db:migrate
```

5. Seed the database:

```bash
pnpm run db:seed
```

6. Start the app:

```bash
pnpm run dev:web
```

The app runs at `http://localhost:3001`.

## Sample Search Options

After running `pnpm run db:seed`, you can use these search values to get results:

- Departure: `Tangier` | Arrival: `Casablanca` | Date: `2026-03-17`
- Departure: `Casablanca` | Arrival: `Rabat` | Date: `2026-03-17`
- Departure: `Marrakech` | Arrival: `Agadir` | Date: `2026-03-18`
- Departure: `Fes` | Arrival: `Tangier` | Date: `2026-03-19`
- Departure: `Rabat` | Arrival: `Oujda` | Date: `2026-03-20`
- Departure: `Agadir` | Arrival: `Marrakech` | Date: `2026-03-21`
