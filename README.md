# Fliproute - Smart Shipment Tracking Platform

Fliproute is a modern, intelligent logistics platform that provides real-time shipment tracking, predictive analytics, and seamless delivery management for businesses of all sizes.

## 🚀 Features

- **Real-time Tracking**: Live updates on shipment location and status
- **Smart Routing**: AI-powered route optimization for faster deliveries
- **Predictive ETA**: Accurate delivery time predictions using machine learning
- **Admin Dashboard**: Comprehensive management tools for logistics operations
- **Public Tracking**: Customer-friendly tracking interface
- **Mobile Responsive**: Works seamlessly across all devices
- **API Integration**: RESTful APIs for custom integrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
fliproute/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── dashboard/         # Customer dashboard
│   ├── admin/             # Admin panel
│   ├── track/             # Public tracking
│   ├── pricing/           # Pricing page
│   └── login/             # Authentication
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── shipment/         # Shipment-specific components
│   └── admin/            # Admin components
├── lib/                  # Utilities and configurations
├── styles/               # Global styles
└── public/               # Static assets
```

## 👤 Admin Account Setup

To create an admin account for system management and periodic updates:

### Method 1: Using Admin Setup Page (Recommended)
1. First, create an initial admin using Method 2 or 3 below
2. Log in as admin
3. Navigate to `/admin/setup`
4. Create additional admin accounts through the UI

### Method 2: Using Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" and create a new user with email and password
3. Copy the user's UUID from the user list
4. Go to SQL Editor and run:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 'USER_UUID_HERE';
   ```

### Method 3: Using Setup Script
1. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
2. Run: `npx tsx scripts/setup-admin.ts`
3. Follow the prompts to create an admin account

**Note:** The service role key is required for creating users programmatically. Keep it secure and never expose it in client-side code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fliproute.git
   cd fliproute
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=https://flipnodes.com
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup below)
   - Configure authentication settings

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Tables

Create the following tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Shipments Table
```sql
CREATE TABLE shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'at_port', 'delivered', 'failed')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  eta DATE,
  carrier TEXT,
  container TEXT,
  vessel TEXT,
  voyage TEXT,
  weight DECIMAL,
  volume DECIMAL,
  value DECIMAL,
  cargo_type TEXT,
  special_instructions TEXT,
  progress INTEGER DEFAULT 0,
  customer_id UUID REFERENCES users(id),
  shipper_name TEXT,
  consignee_name TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  bill_of_lading TEXT,
  customs_status TEXT,
  insurance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tracking Events Table
```sql
CREATE TABLE tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  location TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🌐 Domain Configuration

This application is hosted on **flipnodes.com** but branded as **Fliproute**. 

### Environment Variables for Production
```env
NEXT_PUBLIC_APP_URL=https://flipnodes.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔒 Security

See [README-SECURITY.md](./README-SECURITY.md) for comprehensive security documentation.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@flipnodes.com or visit [https://flipnodes.com](https://flipnodes.com)
