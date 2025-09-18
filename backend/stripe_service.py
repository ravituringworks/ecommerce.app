import stripe
import os
from typing import Dict, Any
from fastapi import HTTPException
from models import Order, User
from sqlalchemy.orm import Session

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    def __init__(self):
        self.stripe_key = os.getenv("STRIPE_SECRET_KEY")
        if not self.stripe_key:
            raise ValueError("STRIPE_SECRET_KEY environment variable is required")
        stripe.api_key = self.stripe_key

    def create_customer(self, user: User) -> str:
        """Create a Stripe customer for a user"""
        try:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={
                    "user_id": str(user.id)
                }
            )
            return customer.id
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Failed to create customer: {str(e)}")

    def create_payment_intent(
        self, 
        amount: int,  # Amount in cents
        currency: str = "usd",
        customer_id: str = None,
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Create a Stripe payment intent"""
        try:
            intent_data = {
                "amount": amount,
                "currency": currency,
                "automatic_payment_methods": {
                    "enabled": True,
                },
            }
            
            if customer_id:
                intent_data["customer"] = customer_id
            
            if metadata:
                intent_data["metadata"] = metadata

            payment_intent = stripe.PaymentIntent.create(**intent_data)
            
            return {
                "client_secret": payment_intent.client_secret,
                "payment_intent_id": payment_intent.id,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "status": payment_intent.status
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Failed to create payment intent: {str(e)}")

    def confirm_payment_intent(self, payment_intent_id: str) -> Dict[str, Any]:
        """Retrieve and confirm a payment intent status"""
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                "id": payment_intent.id,
                "status": payment_intent.status,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "customer": payment_intent.customer
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Failed to retrieve payment intent: {str(e)}")

    def handle_webhook_event(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if not webhook_secret:
            raise HTTPException(status_code=400, detail="Webhook secret not configured")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            return event
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")

    def update_order_payment_status(self, db: Session, order: Order, payment_status: str, payment_intent_id: str = None):
        """Update order payment status"""
        order.payment_status = payment_status
        if payment_intent_id:
            order.payment_intent_id = payment_intent_id
        
        # Update order status based on payment status
        if payment_status == "succeeded":
            order.status = "confirmed"
        elif payment_status == "failed":
            order.status = "cancelled"
        
        db.commit()
        db.refresh(order)
        return order
