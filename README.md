# Super Admin Panel - Restaurant Management System

This is a standalone admin panel for managing all restaurants, plans, and subscriptions in the Restaurant Management System.

## Features

### Dashboard
- View total statistics (restaurants, plans, staff)
- Monitor active subscriptions
- Track expiring and expired plans
- Quick health overview

### Restaurant Management
- **View all restaurants** with subscription details
- **Create new restaurants** with admin credentials
- **Update restaurant** information and plans
- **Delete restaurants** (removes all associated data)
- **View staff members** for each restaurant
- Color-coded status indicators (Active/Expiring/Expired)

### Plan Management
- **View all subscription plans**
- **Create new plans** with custom pricing and features
- **Update existing plans** (name, duration, price, features)
- **Delete plans** (protected if in use)
- Active/Inactive status management
- Feature list customization

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Super Admin Account

First, ensure the backend is running, then seed the super admin:

```bash
cd ../backend
node seedSuperAdmin.js
```

Default credentials:
- **Username:** `superadmin`
- **Password:** `admin123`

⚠️ Change these credentials after first login!

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will start on **http://localhost:5174**

### 4. Build for Production

```bash
npm run build
```

## Default Login

**URL:** http://localhost:5174/login

**Credentials:**
- Username: `superadmin`
- Password: `admin123`

## API Configuration

The admin panel connects to the backend API at `http://localhost:3000/api`

To change this, edit `src/api.ts`:

```typescript
const API_BASE = 'http://localhost:3000/api';
```

## Pages

### Dashboard (`/`)
- Statistics overview
- System health metrics
- Quick access to key data

### Restaurants (`/restaurants`)
- List all restaurants with details
- Create/Edit/Delete operations
- View subscription status and days remaining
- View staff members per restaurant
- Update plans for restaurants

### Plans (`/plans`)
- List all subscription plans
- Create custom plans
- Edit plan details (price, duration, features)
- Delete unused plans
- Activate/deactivate plans

## Features in Detail

### Restaurant Creation
When creating a restaurant:
- Restaurant name
- Admin username (unique)
- Admin password
- Optional: Assign a plan (defaults to Free Trial)

### Plan Assignment
- Select from existing plans
- Automatically calculates start and end dates
- Days remaining updates in real-time

### Staff Viewing
- Click the user icon on any restaurant
- View all staff members with credentials
- See creation dates

### Status Indicators
- 🟢 **Green/Active**: >7 days remaining
- 🟡 **Yellow/Expiring Soon**: 3-7 days remaining
- 🔴 **Red/Critical**: <3 days remaining
- 🔴 **Red/Expired**: Plan expired

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tool

## Project Structure

```
admin/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx      # Statistics dashboard
│   │   ├── Restaurants.tsx    # Restaurant management
│   │   ├── Plans.tsx          # Plan management
│   │   └── LoginPage.tsx      # Authentication
│   ├── components/
│   │   ├── DashboardLayout.tsx # Main layout with sidebar
│   │   └── Toast.tsx           # Toast notifications
│   ├── api.ts                  # API functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints Used

### Authentication
- `POST /api/superadmin/login` - Super admin login

### Dashboard
- `GET /api/superadmin/dashboard/stats` - Get statistics

### Restaurants
- `GET /api/superadmin/restaurants` - List all restaurants
- `GET /api/superadmin/restaurants/:id` - Get restaurant details
- `POST /api/superadmin/restaurants` - Create restaurant
- `PUT /api/superadmin/restaurants/:id` - Update restaurant
- `DELETE /api/superadmin/restaurants/:id` - Delete restaurant
- `GET /api/superadmin/restaurants/:id/staff` - Get restaurant staff

### Plans
- `GET /api/superadmin/plans` - List all plans
- `POST /api/superadmin/plans` - Create plan
- `PUT /api/superadmin/plans/:id` - Update plan
- `DELETE /api/superadmin/plans/:id` - Delete plan

## Development Notes

### Authentication
- Login credentials stored in `localStorage`
- Token: `superadmin_token`
- User data: `superadmin_user`

### Logout
- Clears localStorage
- Redirects to login page

### Auto-refresh
- Dashboard stats refresh on page load
- Restaurant list updates after operations
- Plan list updates after operations

## Security Notes

1. **Change default password** after first login
2. The super admin has **full control** over all restaurants
3. Deleting a restaurant **removes all data** (users, staff, etc.)
4. Deleting a plan is **prevented** if restaurants are using it

## Troubleshooting

### Can't login
- Ensure backend is running on port 3000
- Check that super admin was seeded (run `node seedSuperAdmin.js`)
- Verify credentials: `superadmin` / `admin123`

### Data not loading
- Check backend API is accessible
- Open browser console for error messages
- Verify API_BASE URL in `src/api.ts`

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`

## Support

For issues or questions about the admin panel, refer to the main project documentation or contact the system administrator.

---

**Version:** 1.0.0  
**Last Updated:** October 24, 2025
