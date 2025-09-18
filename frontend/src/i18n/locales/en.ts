export const en = {
  nav: {
    products: 'Products',
    profile: 'Profile',
    orders: 'Orders',
    logout: 'Logout',
    login: 'Login',
    signUp: 'Sign Up',
  },
  meta: {
    siteTitle: 'ShopSmart',
    siteDescription: 'Modern ecommerce store built with Next.js and Python',
    productWord: 'Product',
    productFallbackDescription: (name?: string) => name ? `Buy ${name} at the best price.` : 'View product details and buy online.'
  },
  common: {
    errorLoadingProducts: 'Error loading products',
    pleaseTryAgainLater: 'Please try again later.',
    noProductsFound: 'No products found',
    checkBackLater: 'Check back later for new products!',
    addedToCart: 'Added to cart!',
    pleaseLoginToAddToCart: 'Please login to add items to cart',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    adding: 'Adding...'
  },
  home: {
    welcomeTitle: 'Welcome to Our Store',
    welcomeSubtitle: 'Discover amazing products at great prices',
  },
  products: {
    allProductsTitle: 'All Products',
    browseAll: 'Browse our complete collection',
  },
  pdp: {
    productNotFound: 'Product not found',
    home: 'Home',
    products: 'Products',
    relatedProducts: 'Related Products',
    stock: 'Stock',
    sku: 'SKU',
    returns: 'Returns',
    returnsPolicy: '30-day return policy',
    decreaseQty: 'Decrease quantity',
    increaseQty: 'Increase quantity'
  },
  login: {
    title: 'Sign in to your account',
    createAccountCta: 'create a new account',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password',
    or: 'Or',
  },
  register: {
    title: 'Create your account',
    signInCta: 'sign in to your existing account',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    namePlaceholder: 'Full name',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password',
    confirmPasswordPlaceholder: 'Confirm password',
    errors: {
      nameRequired: 'Name is required',
      nameMin: 'Name must be at least 2 characters',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      passwordRequired: 'Password is required',
      passwordMin: 'Password must be at least 6 characters',
      confirmPasswordRequired: 'Please confirm your password',
      passwordsDontMatch: 'Passwords do not match'
    }
  },
  cart: {
    pleaseLoginToView: 'Please log in to view your cart',
    login: 'Login',
    emptyTitle: 'Your cart is empty',
    emptySubtitle: 'Add some products to get started!',
    continueShopping: 'Continue Shopping',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    itemRemoved: 'Item removed from cart',
    removeFailed: 'Failed to remove item',
    updateFailed: 'Failed to update quantity'
  },
  orders: {
    pleaseLoginToView: 'Please log in to view your orders',
    login: 'Login',
    noOrdersTitle: 'No orders yet',
    noOrdersSubtitle: "When you place orders, they'll show up here.",
    startShopping: 'Start Shopping',
    yourOrders: 'Your Orders',
    viewDetails: 'View Details',
    shippingAddress: 'Shipping Address',
    items: 'Items',
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
  }
} as const
