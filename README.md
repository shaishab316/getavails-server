# GetAvails

A comprehensive event management system with multi-role support including artists, agents, venues, and organizers. Features real-time chat, Stripe payments, booking management, and detailed analytics dashboards.

[![Template](https://img.shields.io/badge/🗂️%20express--it-blue?style=for-the-badge&logoColor=white)](https://github.com/shaishab316/express-it)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Stripe](https://img.shields.io/badge/stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Redis](https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## 🌟 Key Features

### 👥 Multi-Role User Management

- **Artists**: Profile management, agent relationships, booking tracking
- **Agents**: Artist representation, offer creation, commission management (20%)
- **Venues**: Availability management, booking acceptance, revenue tracking
- **Organizers**: Event creation, artist/venue booking, ticket sales
- Role-based authentication and authorization
- Account verification via OTP
- Password reset functionality

### 🎭 Event Management

- Create and manage events with detailed information
- Ticket pricing and capacity management
- Event status tracking (Draft, Published, Completed, Timeout)
- Event search and filtering
- Organizer dashboard with event statistics

### 💼 Booking System

- **Agent Offers**: Agents create offers for artists to organizers
- **Venue Offers**: Venues send offers to organizers
- Offer status management (Pending, Approved, Cancelled)
- Automated commission splits:
  - Artists receive 80% of booking amount
  - Agents receive 20% of booking amount
  - Venues receive full booking amount minus Stripe fees
- Date range booking with conflict prevention

### 💳 Payment Integration

- Stripe Checkout for secure payments
- Support for agent offers, venue offers, and ticket purchases
- Automated wallet crediting after successful payments
- Withdrawal system with Stripe Connect
- Transaction history and balance tracking

### 🎟️ Ticket System

- Real-time ticket availability tracking
- Secure ticket purchase flow with 5-minute reservation
- Automatic capacity management
- Ticket expiration handling for unpaid reservations
- QR code generation for ticket validation

### 💬 Real-time Chat

- Socket.io powered messaging
- Private conversations between users
- Message deletion with cascade cleanup
- Media file sharing support
- Read receipts and online status
- Unread message filtering

### 📊 Analytics & Dashboards

- **Artist Dashboard**:
  - Total revenue (80% commission)
  - Total bookings
  - Monthly booking statistics
  - Monthly revenue trends
- **Agent Dashboard**:
  - Total revenue (20% commission)
  - Total bookings
  - Monthly booking statistics
  - Monthly revenue trends
- **Venue Dashboard**:
  - Total revenue
  - Total bookings
  - Monthly booking statistics
  - Monthly revenue trends
- **Organizer Dashboard**:
  - Total ticket revenue
  - Total tickets sold
  - Monthly event statistics
  - Monthly revenue trends

### 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Input validation with Zod schemas
- Secure password hashing with bcrypt
- OTP verification for sensitive operations

### 🛠️ Background Jobs

- Bull queue for job processing
- Email notifications (account verification, password reset)
- File deletion queue for media cleanup
- Stripe account connection queue
- Withdrawal processing queue
- Automatic ticket expiration cleanup

## 🏗️ Architecture

[![ER_Diagram.svg](./ER_Diagram.svg)](./ER_Diagram.svg)

### Database Schema

- **Users**: Multi-role user system with role-specific fields
- **Events**: Event management with organizer relationships
- **Tickets**: Ticket booking and payment tracking
- **Agent Offers**: Artist booking offers from agents
- **Venue Offers**: Venue booking offers to organizers
- **Chats & Messages**: Real-time messaging system
- Optimized indexes for performance
- Cascading deletes for data integrity

### Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for WebSocket connections
- **Payments**: Stripe (Checkout, Connect, Webhooks)
- **Caching**: Redis for session and queue management
- **Email**: Nodemailer with MJML templates
- **Validation**: Zod for runtime type checking
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer for media handling

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- Stripe account
- Docker (optional)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/shaishab316/getavails-server.git
cd getavails-server
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:

```bash
npm run prisma-generate
npm run prisma-migrate
```

5. Seed initial data (optional):

```bash
npm run seed-admin     # Create admin user
npm run seed-stripe    # Set up Stripe webhooks
```

6. Start the development server:

```bash
docker-compose up -d # optional, for postgres and redis
npm run dev
```

## 🚀 Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prettier         # Format code with Prettier
npm run type-check       # TypeScript type checking
npm run prisma-studio    # Open Prisma Studio
npm run prisma-migrate   # Run database migrations
npm run prisma-generate  # Generate Prisma Client
npm run new-module       # Generate new module scaffold
```

### [📝 Api Documentation](./postman/collections/34549363-df5de993-81f2-423d-bf12-3043cc55f41d.json)

## 👨‍💻 Author

**Shaishab Chandra Shil**

- GitHub: [@shaishab316](https://github.com/shaishab316)
- Repository: [getavails-server](https://github.com/shaishab316/getavails-server)

## 🙏 Acknowledgments

- Built with [express-it](https://github.com/shaishab316/express-it) template
