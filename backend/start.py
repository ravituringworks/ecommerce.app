#!/usr/bin/env python3
"""
Startup script for the ecommerce backend.
This script initializes the database and creates some sample data.
"""

from database import SessionLocal, engine
import models
from models import User, Product
import bcrypt

def create_sample_data():
    """Create sample products and a test user"""
    db = SessionLocal()
    
    try:
        # Create sample products if none exist
        if db.query(Product).count() == 0:
            sample_products = [
                {
                    "name": "Wireless Headphones",
                    "description": "High-quality wireless headphones with noise cancellation",
                    "price": 199.99,
                    "category": "Electronics",
                    "stock_quantity": 50,
                    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                },
                {
                    "name": "Smartphone",
                    "description": "Latest model smartphone with advanced features",
                    "price": 699.99,
                    "category": "Electronics",
                    "stock_quantity": 30,
                    "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop"
                },
                {
                    "name": "Coffee Maker",
                    "description": "Premium coffee maker for the perfect brew",
                    "price": 149.99,
                    "category": "Kitchen",
                    "stock_quantity": 25,
                    "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop"
                },
                {
                    "name": "Laptop Backpack",
                    "description": "Durable laptop backpack with multiple compartments",
                    "price": 79.99,
                    "category": "Accessories",
                    "stock_quantity": 40,
                    "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
                },
                {
                    "name": "Fitness Tracker",
                    "description": "Advanced fitness tracker with heart rate monitor",
                    "price": 249.99,
                    "category": "Electronics",
                    "stock_quantity": 35,
                    "image_url": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop"
                },
                {
                    "name": "Desk Lamp",
                    "description": "Modern LED desk lamp with adjustable brightness",
                    "price": 59.99,
                    "category": "Home",
                    "stock_quantity": 20,
                    "image_url": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&h=500&fit=crop"
                }
            ]
            
            for product_data in sample_products:
                product = Product(**product_data)
                db.add(product)
            
            print("✅ Sample products created")
        
        # Create a test user if none exist
        if db.query(User).count() == 0:
            hashed_password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt())
            test_user = User(
                email="test@example.com",
                name="Test User",
                hashed_password=hashed_password.decode('utf-8')
            )
            db.add(test_user)
            print("✅ Test user created (email: test@example.com, password: password123)")
        
        db.commit()
        print("✅ Database initialized successfully")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing ecommerce database...")
    
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Create sample data
    create_sample_data()
    
    print("\n🎉 Setup complete! You can now start the server with:")
    print("uvicorn main:app --reload --port 8000")
