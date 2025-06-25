# MapleEats 🍁

A modern food delivery application built with React, TypeScript, and Supabase. Order your favorite meals with a seamless user experience, complete with phone authentication, real-time order tracking, and secure data management.

## Features

- 🍔 **Restaurant Menu**: Browse through a variety of food items with detailed descriptions and pricing
- 🛒 **Shopping Cart**: Add/remove items with quantity controls and real-time price calculation
- 📍 **Location Services**: Set delivery address with location-based services
- 📱 **Phone Authentication**: Secure login with phone number and OTP verification via Supabase
- 👤 **User Profiles**: Manage personal information and view complete order history
- 📦 **Order Management**: Track orders with real-time status updates and delivery tracking
- 💳 **Checkout Process**: Multi-step checkout with form validation and Cash on Delivery
- 🗄️ **Database Integration**: Supabase backend for secure user data and order management
- 🔒 **Row Level Security**: User data protection with Supabase RLS policies
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations using Framer Motion
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Build Tool**: Vite
- **UI Components**: Custom components with Framer Motion animations
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Validation**: Custom validation with real-time feedback

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/maple-eats.git
   cd maple-eats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the detailed instructions in `SUPABASE_SETUP.md`
   - Create your Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Configure phone authentication

4. **Environment Variables**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ENABLE_API_LOGGING=false
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Authentication Flow

1. **Phone Number Entry**: Users enter their phone number
2. **OTP Verification**: SMS OTP sent via Supabase/Twilio integration
3. **Profile Setup**: First-time users complete their profile
4. **Authenticated Access**: Full access to ordering and order history

## Database Schema

The application uses two main tables:

- **users**: Store user profiles with phone, name, email
- **orders**: Store order details with items, delivery info, pricing, and tracking

Both tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Order Management

- **Local Storage**: Orders stored locally for non-authenticated users
- **Supabase Integration**: Authenticated users get persistent order history
- **Real-time Updates**: Order status updates with tracking information
- **Status Progression**: pending → confirmed → preparing → ready → out_for_delivery → delivered

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   └── templates/      # Page layouts
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── types/              # TypeScript type definitions
└── lib/                # Utility libraries and configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- User authentication via Supabase Auth
- Row Level Security (RLS) on all database tables
- Secure API endpoints with proper authorization
- Environment variables for sensitive configuration

## Future Enhancements

- [ ] Push notifications for order updates
- [ ] Payment gateway integration
- [ ] Restaurant management dashboard
- [ ] Delivery tracking with maps
- [ ] Review and rating system
- [ ] Loyalty program
- [ ] Multiple restaurant support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the `SUPABASE_SETUP.md` for setup help
- Review the troubleshooting section in setup documentation

---

Built with ❤️ using React, TypeScript, and Supabase