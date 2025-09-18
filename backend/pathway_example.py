"""
Example: Using Pathway for Real-time E-commerce Analytics

This example demonstrates how to use Pathway for real-time data processing
in your e-commerce application.
"""

import pathway as pw
import warnings
warnings.filterwarnings('ignore', category=UserWarning)

# Define schemas for your e-commerce data
class OrderSchema(pw.Schema):
    order_id: int
    user_id: int
    product_id: int
    quantity: int
    price: float
    timestamp: int

class ProductSchema(pw.Schema):
    product_id: int
    name: str
    category: str
    stock: int

def create_sample_data():
    """Create sample data for demonstration"""
    # Sample order data
    orders_data = pw.debug.table_from_markdown("""
    | order_id | user_id | product_id | quantity | price | timestamp
    1 | 1001     | 101     | 501        | 2        | 29.99 | 1640995200
    2 | 1002     | 102     | 502        | 1        | 49.99 | 1640995260
    3 | 1003     | 101     | 503        | 3        | 19.99 | 1640995320
    4 | 1004     | 103     | 501        | 1        | 29.99 | 1640995380
    """)
    
    # Sample product data
    products_data = pw.debug.table_from_markdown("""
    | product_id | name          | category    | stock
    1 | 501        | Laptop Stand  | Electronics | 50
    2 | 502        | Wireless Mouse| Electronics | 100
    3 | 503        | Coffee Mug    | Home        | 25
    """)
    
    return orders_data, products_data

def analyze_sales_data(orders, products):
    """Perform real-time analytics on sales data"""
    
    # Calculate total revenue per user
    user_revenue = orders.groupby(orders.user_id).reduce(
        user_id=orders.user_id,
        total_revenue=pw.reducers.sum(orders.price * orders.quantity),
        total_orders=pw.reducers.count()
    )
    
    # Calculate product sales statistics
    product_stats = orders.groupby(orders.product_id).reduce(
        product_id=orders.product_id,
        total_quantity_sold=pw.reducers.sum(orders.quantity),
        total_revenue=pw.reducers.sum(orders.price * orders.quantity),
        order_count=pw.reducers.count()
    )
    
    # Calculate total sales metrics
    total_metrics = orders.reduce(
        total_orders=pw.reducers.count(),
        total_revenue=pw.reducers.sum(orders.price * orders.quantity),
        avg_order_value=pw.reducers.avg(orders.price * orders.quantity)
    )
    
    return user_revenue, product_stats, total_metrics

def main():
    """Main function to demonstrate Pathway usage"""
    print("🚀 Pathway E-commerce Analytics Demo")
    print("="*50)
    
    # Create sample data
    orders, products = create_sample_data()
    
    # Perform analytics
    user_revenue, product_stats, total_metrics = analyze_sales_data(orders, products)
    
    print("\n📊 Analysis complete!")
    print("- User revenue calculations")
    print("- Product sales statistics") 
    print("- Overall business metrics")
    
    print("\n✅ Pathway pipeline created successfully!")
    print("\n💡 In a real application, you would:")
    print("- Connect to your database as a data source")
    print("- Set up real-time streaming from order events")
    print("- Create dashboards with the computed metrics")
    print("- Trigger alerts for low stock or high-value customers")
    print("- Use pw.run() to execute the computation pipeline")
    
    # Note: In production, you would use pw.run() to execute the computation
    # For this demo, we just show the pipeline setup
    
    return user_revenue, product_stats, total_metrics

if __name__ == "__main__":
    main()
