# 🛒 Modern Ecommerce Store

A full-stack ecommerce application built with **Next.js 14** (frontend) and **FastAPI** (Python backend).

## 🚀 Features

### Frontend (Next.js 14)
- **Modern UI/UX** with Tailwind CSS
- **TypeScript** for type safety
- **App Router** with file-based routing
- **React Query** for data fetching and caching
- **Zustand** for state management
- **Responsive design** for all devices
- **Authentication** with JWT tokens
- **Shopping cart** functionality
- **Order management** and history

### Backend (FastAPI)
- **RESTful API** with automatic OpenAPI documentation
- **JWT authentication** and authorization
- **SQLAlchemy ORM** with database models
- **Pydantic** for data validation
- **CORS** enabled for frontend integration
- **PostgreSQL/SQLite** database support
- **Password hashing** with bcrypt

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm or yarn**

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your settings

# Initialize database with sample data
python start.py

# Start the server
uvicorn main:app --reload --port 8000
```

The backend API will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.local.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

## 🎯 Usage

### Test Account
A test user is automatically created:
- **Email**: test@example.com
- **Password**: password123

### API Documentation
FastAPI provides automatic API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Project Structure

```
ecommerce-app/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic data validation schemas
│   ├── database.py          # Database configuration
│   ├── start.py             # Database initialization script
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── lib/            # API client and utilities
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── next.config.js      # Next.js configuration
└── README.md               # This file
```

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./ecommerce.db
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 Key Features

### User Authentication
- User registration and login
- JWT token-based authentication
- Protected routes and API endpoints
- Password hashing with bcrypt

### Product Management
- Browse products with search and filtering
- Product detail pages
- Category-based organization
- Stock quantity tracking

### Shopping Cart
- Add/remove items from cart
- Quantity adjustment
- Real-time cart updates
- Persistent cart state

### Order Management
- Secure checkout process
- Order history and tracking
- Order status updates
- Shipping address management

### Responsive Design
- Mobile-first approach
- Modern UI components
- Smooth animations and transitions
- Cross-browser compatibility

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (authenticated)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/{id}` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order

## 🚀 Production Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Update `DATABASE_URL` in environment variables
3. Set a strong `SECRET_KEY`
4. Deploy using Docker, Heroku, or cloud platforms
5. Configure CORS origins for your domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Update `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy to Vercel, Netlify, or other platforms

## 🛡️ Security Features

- **Password hashing** with bcrypt
- **JWT token authentication**
- **CORS protection**
- **Input validation** with Pydantic
- **SQL injection protection** with SQLAlchemy
- **XSS protection** with React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the API documentation at `/docs`
2. Review the console logs for errors
3. Ensure all environment variables are set correctly
4. Verify both frontend and backend servers are running

## 🎉 Getting Started

1. Follow the installation steps above
2. Visit http://localhost:3000
3. Register a new account or use the test account
4. Browse products and add them to your cart
5. Complete the checkout process
6. View your order history

Enjoy building with this modern ecommerce stack! 🚀
