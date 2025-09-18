from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import bcrypt
import os
from dotenv import load_dotenv

from database import SessionLocal, engine
import models
import schemas
from stripe_service import StripeService

# Load environment variables from .env
load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ecommerce API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

# Stripe service (initialize only if Stripe keys are available)
stripe_service = None
try:
    if os.getenv("STRIPE_SECRET_KEY"):
        stripe_service = StripeService()
except Exception as e:
    print(f"Warning: Stripe service not initialized: {e}")

# Payment mode (stripe or mock)
PAYMENT_MODE = os.getenv("PAYMENT_MODE")
if not PAYMENT_MODE:
    PAYMENT_MODE = "stripe" if stripe_service else "mock"
print(f"Payment mode: {PAYMENT_MODE}")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Auth endpoints
@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password.decode('utf-8')
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Find user
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check password
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = jwt.encode(
        {"sub": db_user.id, "exp": datetime.utcnow() + access_token_expires},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

# Product endpoints
# Locale helpers and localized content map
SUPPORTED_LOCALES = {"en", "es", "zh", "ja"}

PRODUCT_LOCALIZED_CONTENT = {
    "en": {
        1: {"name": "Wireless Headphones", "description": "High-quality wireless headphones with noise cancellation"},
        2: {"name": "Smartphone", "description": "Latest model smartphone with advanced features"},
        3: {"name": "Coffee Maker", "description": "Premium coffee maker for the perfect brew"},
        4: {"name": "Laptop Backpack", "description": "Durable laptop backpack with multiple compartments"},
        5: {"name": "Fitness Tracker", "description": "Advanced fitness tracker with heart rate monitor"},
        6: {"name": "Desk Lamp", "description": "Modern LED desk lamp with adjustable brightness"},
    },
    "es": {
        1: {"name": "Auriculares Inalámbricos", "description": "Auriculares inalámbricos de alta calidad con cancelación de ruido"},
        2: {"name": "Teléfono Inteligente", "description": "Último modelo de smartphone con funciones avanzadas"},
        3: {"name": "Cafetera", "description": "Cafetera premium para el café perfecto"},
        4: {"name": "Mochila para Portátil", "description": "Mochila duradera con múltiples compartimentos"},
        5: {"name": "Rastreador de Actividad", "description": "Pulsera avanzada con monitor de ritmo cardíaco"},
        6: {"name": "Lámpara de Escritorio", "description": "Lámpara LED moderna con brillo ajustable"},
    },
    "zh": {
        1: {"name": "无线耳机", "description": "高品质无线耳机，支持降噪功能"},
        2: {"name": "智能手机", "description": "最新款智能手机，功能强大"},
        3: {"name": "咖啡机", "description": "高端咖啡机，打造完美咖啡"},
        4: {"name": "笔记本电脑背包", "description": "耐用多隔层笔记本电脑背包"},
        5: {"name": "健身手环", "description": "高级健身手环，支持心率监测"},
        6: {"name": "台灯", "description": "现代LED台灯，亮度可调"},
    },
    "ja": {
        1: {"name": "ワイヤレスヘッドホン", "description": "高品質のノイズキャンセリング搭載ワイヤレスヘッドホン"},
        2: {"name": "スマートフォン", "description": "最新モデルの高機能スマートフォン"},
        3: {"name": "コーヒーメーカー", "description": "理想の一杯を淹れるプレミアムコーヒーメーカー"},
        4: {"name": "ノートPC用バックパック", "description": "丈夫で収納力の高いバックパック"},
        5: {"name": "フィットネストラッカー", "description": "心拍数測定対応の高機能トラッカー"},
        6: {"name": "デスクランプ", "description": "明るさ調整が可能なモダンLEDデスクランプ"},
    },
}

def _extract_locale(lang_param: Optional[str], request: Request) -> str:
    if lang_param and lang_param.lower() in SUPPORTED_LOCALES:
        return lang_param.lower()
    # Parse Accept-Language header (e.g., "es-ES,es;q=0.9")
    accept_lang = request.headers.get("accept-language", "")
    if accept_lang:
        primary = accept_lang.split(",")[0].strip().lower()
        base = primary.split("-")[0]
        if base in SUPPORTED_LOCALES:
            return base
    return "en"


def _serialize_product(prod: models.Product, locale: str) -> dict:
    overrides = PRODUCT_LOCALIZED_CONTENT.get(locale, {}).get(prod.id, {})
    name = overrides.get("name", prod.name)
    description = overrides.get("description", prod.description)
    return {
        "id": prod.id,
        "name": name,
        "description": description,
        "price": prod.price,
        "image_url": prod.image_url,
        "category": prod.category,
        "stock_quantity": prod.stock_quantity,
        "is_active": prod.is_active,
        "created_at": prod.created_at,
    }


@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 20,
    lang: Optional[str] = None,
    request: Request = None,
    db: Session = Depends(get_db),
):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    locale = _extract_locale(lang, request)
    return [_serialize_product(p, locale) for p in products]


@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, lang: Optional[str] = None, request: Request = None, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    locale = _extract_locale(lang, request)
    return _serialize_product(product, locale)

@app.post("/api/products", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Cart endpoints
@app.get("/api/cart", response_model=List[schemas.CartItemResponse])
def get_cart(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    return cart_items

@app.post("/api/cart", response_model=schemas.CartItemResponse)
def add_to_cart(cart_item: schemas.CartItemCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if item already in cart
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id,
        models.CartItem.product_id == cart_item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        db_cart_item = models.CartItem(
            user_id=current_user.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item

@app.delete("/api/cart/{item_id}")
def remove_from_cart(item_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}

# Order endpoints
@app.post("/api/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Create order
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=order.total_amount,
        status="pending",
        shipping_address=order.shipping_address
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_order_item)
    
    # Do NOT clear the cart here. It will be cleared after successful payment.
    db.commit()
    return db_order

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@app.get("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Payment endpoints
@app.post("/api/create-payment-intent")
def create_payment_intent(
    request: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe payment intent for an order"""
    # Check mode
    if PAYMENT_MODE != "stripe":
        raise HTTPException(status_code=400, detail="Stripe is disabled. Set PAYMENT_MODE=stripe to enable.")
    if not stripe_service:
        raise HTTPException(status_code=500, detail="Payment service not available")
    
    try:
        order_id = request.get("order_id")
        if not order_id:
            raise HTTPException(status_code=400, detail="Order ID is required")
        
        # Get the order
        order = db.query(models.Order).filter(
            models.Order.id == order_id,
            models.Order.user_id == current_user.id
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Create or get Stripe customer
        customer_id = current_user.stripe_customer_id
        if not customer_id:
            customer_id = stripe_service.create_customer(current_user)
            # Update user with Stripe customer ID
            current_user.stripe_customer_id = customer_id
            db.commit()
        
        # Convert amount to cents
        amount_cents = int(order.total_amount * 100)
        
        # Create payment intent
        payment_intent = stripe_service.create_payment_intent(
            amount=amount_cents,
            customer_id=customer_id,
            metadata={
                "order_id": str(order.id),
                "user_id": str(current_user.id)
            }
        )
        
        # Update order with payment intent ID
        order.payment_intent_id = payment_intent["payment_intent_id"]
        order.stripe_customer_id = customer_id
        db.commit()
        
        return {
            "client_secret": payment_intent["client_secret"],
            "payment_intent_id": payment_intent["payment_intent_id"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/confirm-payment")
def confirm_payment(
    request: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Confirm payment and update order status"""
    if PAYMENT_MODE != "stripe":
        raise HTTPException(status_code=400, detail="Stripe is disabled. Set PAYMENT_MODE=stripe to enable.")
    if not stripe_service:
        raise HTTPException(status_code=500, detail="Payment service not available")
    
    try:
        payment_intent_id = request.get("payment_intent_id")
        if not payment_intent_id:
            raise HTTPException(status_code=400, detail="Payment intent ID is required")
        
        # Get payment intent from Stripe
        payment_info = stripe_service.confirm_payment_intent(payment_intent_id)
        
        # Find the order
        order = db.query(models.Order).filter(
            models.Order.payment_intent_id == payment_intent_id,
            models.Order.user_id == current_user.id
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update order payment status
        stripe_service.update_order_payment_status(
            db, order, payment_info["status"], payment_intent_id
        )
        
        # Clear cart only if payment succeeded
        if payment_info.get("status") == "succeeded":
            db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
            db.commit()
        
        return {
            "order_id": order.id,
            "payment_status": payment_info["status"],
            "order_status": order.status
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stripe-webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    if PAYMENT_MODE != "stripe":
        raise HTTPException(status_code=400, detail="Stripe is disabled. Set PAYMENT_MODE=stripe to enable.")
    if not stripe_service:
        raise HTTPException(status_code=500, detail="Payment service not available")
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe_service.handle_webhook_event(payload, sig_header)
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Find and update the order
            order = db.query(models.Order).filter(
                models.Order.payment_intent_id == payment_intent['id']
            ).first()
            
            if order:
                stripe_service.update_order_payment_status(
                    db, order, "succeeded", payment_intent['id']
                )
                # Clear cart on successful payment via webhook
                db.query(models.CartItem).filter(models.CartItem.user_id == order.user_id).delete()
                db.commit()
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            
            # Find and update the order
            order = db.query(models.Order).filter(
                models.Order.payment_intent_id == payment_intent['id']
            ).first()
            
            if order:
                stripe_service.update_order_payment_status(
                    db, order, "failed", payment_intent['id']
                )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Mock payment endpoint for demo
@app.post("/api/mock-payment")
def mock_payment(
    request: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mock payment processing for demo purposes"""
    try:
        order_id = request.get("order_id")
        card_number = request.get("card_number", "")
        
        if not order_id:
            raise HTTPException(status_code=400, detail="Order ID is required")
        
        # Get the order
        order = db.query(models.Order).filter(
            models.Order.id == order_id,
            models.Order.user_id == current_user.id
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Mock payment logic - accept cards starting with 4
        if card_number.replace(" ", "").startswith("4"):
            order.payment_status = "succeeded"
            order.status = "confirmed"
            order.payment_intent_id = f"mock_pi_{order_id}_{int(datetime.utcnow().timestamp())}"
            
            # Clear cart after successful payment
            db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
            
            db.commit()
            db.refresh(order)
            
            return {
                "status": "succeeded",
                "order_id": order.id,
                "message": "Payment processed successfully"
            }
        else:
            order.payment_status = "failed"
            db.commit()
            
            return {
                "status": "failed",
                "message": "Payment failed. Use a card number starting with 4."
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
