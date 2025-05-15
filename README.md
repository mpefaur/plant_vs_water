# Plants vs Water

A web application for managing plant watering schedules using QR codes.

## Features

- Scan QR codes to view plant watering information
- Track watering history for your plants
- Get reminders when it's time to water your plants
- Generate QR codes to link with your plants
- Mobile-friendly responsive design

## Tech Stack

- Next.js 13 (App Router)
- Tailwind CSS for styling
- Supabase for database and authentication
- QR code scanning and generation
- Containerized with Docker

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Supabase account

### Setup

1. Clone the repository
2. Copy the `.env.example` file to `.env.local` and update with your Supabase credentials
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker

To build and run the application using Docker:

```bash
# Build the Docker image
docker build -t Plants vs Water .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your_url -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key Plants vs Water
```

## Supabase Setup

1. Create a new Supabase project
2. Connect to the project and run the migration in `supabase/migrations/create_tables.sql`
3. Configure storage buckets for plant images
4. Set up CORS policies for your domain

## License

MIT