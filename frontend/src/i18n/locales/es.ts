export const es = {
  nav: {
    products: 'Productos',
    profile: 'Perfil',
    orders: 'Pedidos',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    signUp: 'Registrarse',
  },
  meta: {
    siteTitle: 'ShopSmart',
    siteDescription: 'Tienda en línea moderna construida con Next.js y Python',
    productWord: 'Producto',
    productFallbackDescription: (name?: string) => name ? `Compra ${name} al mejor precio.` : 'Ver detalles del producto y comprar en línea.'
  },
  common: {
    errorLoadingProducts: 'Error cargando productos',
    pleaseTryAgainLater: 'Por favor, inténtalo de nuevo más tarde.',
    noProductsFound: 'No se encontraron productos',
    checkBackLater: '¡Vuelve más tarde para ver nuevos productos!',
    addedToCart: '¡Añadido al carrito!',
    pleaseLoginToAddToCart: 'Inicia sesión para añadir artículos al carrito',
    outOfStock: 'Agotado',
    addToCart: 'Añadir al carrito',
    adding: 'Añadiendo...'
  },
  home: {
    welcomeTitle: 'Bienvenido a Nuestra Tienda',
    welcomeSubtitle: 'Descubre productos increíbles a grandes precios',
  },
  products: {
    allProductsTitle: 'Todos los Productos',
    browseAll: 'Explora toda nuestra colección',
  },
  pdp: {
    productNotFound: 'Producto no encontrado',
    home: 'Inicio',
    products: 'Productos',
    relatedProducts: 'Productos Relacionados',
    stock: 'Stock',
    sku: 'SKU',
    returns: 'Devoluciones',
    returnsPolicy: 'Política de devolución de 30 días',
    decreaseQty: 'Disminuir cantidad',
    increaseQty: 'Aumentar cantidad'
  },
  login: {
    title: 'Inicia sesión en tu cuenta',
    createAccountCta: 'crear una nueva cuenta',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando...',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    or: 'O',
  },
  register: {
    title: 'Crea tu cuenta',
    signInCta: 'inicia sesión en tu cuenta existente',
    createAccount: 'Crear cuenta',
    creatingAccount: 'Creando cuenta...',
    namePlaceholder: 'Nombre completo',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    confirmPasswordPlaceholder: 'Confirmar contraseña',
    errors: {
      nameRequired: 'El nombre es obligatorio',
      nameMin: 'El nombre debe tener al menos 2 caracteres',
      emailRequired: 'El correo es obligatorio',
      emailInvalid: 'Por favor ingresa un correo válido',
      passwordRequired: 'La contraseña es obligatoria',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres',
      confirmPasswordRequired: 'Por favor confirma tu contraseña',
      passwordsDontMatch: 'Las contraseñas no coinciden'
    }
  },
  cart: {
    pleaseLoginToView: 'Inicia sesión para ver tu carrito',
    login: 'Iniciar sesión',
    emptyTitle: 'Tu carrito está vacío',
    emptySubtitle: '¡Agrega algunos productos para comenzar!',
    continueShopping: 'Seguir comprando',
    orderSummary: 'Resumen del pedido',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    free: 'Gratis',
    total: 'Total',
    proceedToCheckout: 'Proceder al pago',
    itemRemoved: 'Artículo eliminado del carrito',
    removeFailed: 'No se pudo eliminar el artículo',
    updateFailed: 'No se pudo actualizar la cantidad'
  },
  orders: {
    pleaseLoginToView: 'Inicia sesión para ver tus pedidos',
    login: 'Iniciar sesión',
    noOrdersTitle: 'Aún no hay pedidos',
    noOrdersSubtitle: 'Cuando realices pedidos, aparecerán aquí.',
    startShopping: 'Comenzar a comprar',
    yourOrders: 'Tus pedidos',
    viewDetails: 'Ver detalles',
    shippingAddress: 'Dirección de envío',
    items: 'Artículos',
    status: {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }
  }
} as const
