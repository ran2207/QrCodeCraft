# QR Code Craft

A modern web application for creating, customizing, and managing QR codes with a beautiful user interface. Built with React, Express.js, and TypeScript.

## 🚀 Features

- Create customizable QR codes
- Real-time QR code preview
- Modern and responsive UI using Tailwind CSS and Radix UI
- Secure backend with Express.js
- Database integration with Drizzle ORM
- User authentication with Passport.js
- TypeScript support for better development experience

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- React Query
- Wouter for routing
- Vite for build tooling

### Backend

- Express.js
- TypeScript
- Passport.js for authentication
- Drizzle ORM
- WebSocket support
- Session management

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (for session storage)

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/QrCodeCraft.git
cd QrCodeCraft
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables (create a `.env` file in the root directory):

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

4. Run database migrations:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm start` - Run the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🏗️ Project Structure

```
QrCodeCraft/
├── client/               # Frontend code
│   ├── src/             # React application source
│   └── index.html       # HTML entry point
├── server/              # Backend code
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Database configuration
├── shared/              # Shared types and utilities
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## 🔒 Security

- Session-based authentication
- CSRF protection
- Secure password handling
- Rate limiting on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [QR Code Styling](https://github.com/kozakdenys/qr-code-styling) for QR code generation
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Express.js](https://expressjs.com/) for the backend framework
