import request from '@/utils/request'

// 订单结算确认（封装购物车购买和立即购买通用的接口）
// mode：cart   => obj { cartIds }
// mode：buyNow => obj { goodsId goodsNum goodsSkuId }
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // cart buyNow
      delivery: 10, // 10 快递配送 20 门店自提
      couponId: 0, // 优惠劵ID 传0 不使用优惠劵
      shopId: 0, // 自提门店ID
      ...obj // 将传递过来的参数对象 动态展开
    }
  })
}

// 提交订单 （封装购物车和立即购买通用的接口）
// mode: cart   => obj { cartIds remark}
// mode: buyNow => obj { goodsId goodsNum goodsSkuId remark}
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    dilivery: 10, // 10 快递配送 20 门店自提
    couponId: 0,
    isUsePoints: 0,
    payType: 10, // 余额支付
    ...obj
  })
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page // List
    }
  })
}
