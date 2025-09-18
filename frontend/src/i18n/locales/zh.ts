export const zh = {
  nav: {
    products: '产品',
    profile: '个人资料',
    orders: '订单',
    logout: '退出登录',
    login: '登录',
    signUp: '注册',
  },
  meta: {
    siteTitle: 'ShopSmart',
    siteDescription: '使用 Next.js 和 Python 构建的现代电商商店',
    productWord: '商品',
    productFallbackDescription: (name?: string) => name ? `以最优惠的价格购买 ${name}。` : '查看商品详情并在线购买。'
  },
  common: {
    errorLoadingProducts: '加载产品时出错',
    pleaseTryAgainLater: '请稍后再试。',
    noProductsFound: '未找到产品',
    checkBackLater: '稍后回来查看新产品！',
    addedToCart: '已加入购物车！',
    pleaseLoginToAddToCart: '请登录后再添加到购物车',
    outOfStock: '缺货',
    addToCart: '加入购物车',
    adding: '正在加入...'
  },
  home: {
    welcomeTitle: '欢迎来到我们的商店',
    welcomeSubtitle: '以优惠的价格发现惊艳的产品',
  },
  products: {
    allProductsTitle: '全部产品',
    browseAll: '浏览我们的全部商品',
  },
  pdp: {
    productNotFound: '未找到商品',
    home: '首页',
    products: '产品',
    relatedProducts: '相关产品',
    stock: '库存',
    sku: 'SKU',
    returns: '退货',
    returnsPolicy: '30天退货政策',
    decreaseQty: '减少数量',
    increaseQty: '增加数量'
  },
  login: {
    title: '登录到您的账户',
    createAccountCta: '创建一个新账户',
    signIn: '登录',
    signingIn: '正在登录...',
    emailPlaceholder: '电子邮件地址',
    passwordPlaceholder: '密码',
    or: '或者',
  },
  register: {
    title: '创建您的账户',
    signInCta: '登录到已有账户',
    createAccount: '创建账户',
    creatingAccount: '正在创建账户...',
    namePlaceholder: '姓名',
    emailPlaceholder: '电子邮件地址',
    passwordPlaceholder: '密码',
    confirmPasswordPlaceholder: '确认密码',
    errors: {
      nameRequired: '姓名是必填项',
      nameMin: '姓名至少需要2个字符',
      emailRequired: '电子邮件是必填项',
      emailInvalid: '请输入有效的电子邮件',
      passwordRequired: '密码是必填项',
      passwordMin: '密码至少需要6个字符',
      confirmPasswordRequired: '请确认您的密码',
      passwordsDontMatch: '两次输入的密码不一致'
    }
  },
  cart: {
    pleaseLoginToView: '请登录以查看您的购物车',
    login: '登录',
    emptyTitle: '您的购物车是空的',
    emptySubtitle: '添加一些产品开始吧！',
    continueShopping: '继续购物',
    orderSummary: '订单摘要',
    subtotal: '小计',
    shipping: '运费',
    free: '免费',
    total: '总计',
    proceedToCheckout: '前往结账',
    itemRemoved: '已从购物车移除',
    removeFailed: '移除失败',
    updateFailed: '更新数量失败'
  },
  orders: {
    pleaseLoginToView: '请登录以查看您的订单',
    login: '登录',
    noOrdersTitle: '还没有订单',
    noOrdersSubtitle: '当您下单后，订单会显示在这里。',
    startShopping: '开始购物',
    yourOrders: '您的订单',
    viewDetails: '查看详情',
    shippingAddress: '收货地址',
    items: '商品',
    status: {
      pending: '待处理',
      confirmed: '已确认',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消'
    }
  }
} as const
