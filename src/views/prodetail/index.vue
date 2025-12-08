<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ total}}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div @click="$router.push('/')" class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart" @click="$router.push('/cart')">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div @click="addFn" class="btn-add">加入购物车</div>
      <div @click="buyFn" class="btn-buy">立刻购买</div>
    </div>

    <!-- 加入购物车的弹层 -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ detail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <!-- v-model应用于组件 本质上是语法糖，:value @input的简写
           :value 是父传子 ， @input 是子传父 -->
          <CountBox v-model="addCount"></CountBox>
        </div>

        <!-- 有库存才显示提交按钮 -->
        <div class="showbtn" v-if="detail.stock_total > 0">
          <div class="btn" v-if="mode === 'cart'" @click="addCart">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getProComments, getProDetail } from '@/api/product'
import defaultImg from '@/assets/default-avatar.png'
import CountBox from '@/components/CountBox.vue'
import { addCart } from '@/api/cart'
import loginConfirm from '@/mixins/loginConfirm'

export default {
  name: 'ProDetail',
  mixins: [loginConfirm],
  components: {
    CountBox
  },
  data () {
    return {
      images: [],
      current: 0,
      detail: {},
      total: 0,
      commentList: [],
      defaultImg,
      showPannel: false, // 控制弹层的显示隐藏
      mode: 'cart', // 标记弹层的状态
      addCount: 1, // 数字框绑定的数据
      cartTotal: 0 // 购物车角标
    }
  },
  computed: {
    goodsId () {
      return this.$route.params.id
    }
  },
  created () {
    this.getDetail()
    this.getComments()
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    async getDetail () {
      const { data: { detail } } = await getProDetail(this.goodsId)
      this.detail = detail
      this.images = detail.goods_images
      // console.log(this.images)
    },
    async getComments () {
      const { data: { list, total } } = await getProComments(this.goodsId, 3)
      this.commentList = list
      this.total = total
    },
    addFn () {
      this.mode = 'cart'
      this.showPannel = true
    },
    buyFn () {
      this.mode = 'buyNow'
      this.showPannel = true
    },
    async addCart () {
      // 1. 先判断是否登录
      if (this.loginConfirm()) {
        return
      }
      // 2. 如果 token 存在，继续请求操作
      const { data } = await addCart(this.goodsId, this.addCount, this.detail.skuList[0].goods_sku_id)
      this.cartTotal = data.cartTotal
      this.$toast('加入购物车成功')
      this.showPannel = false
      // console.log(this.cartTotal)
    },
    goBuyNow () {
      // 先判断是否登录 没登录，直接中断
      if (this.loginConfirm()) {
        return
      }
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          goodsId: this.goodsId,
          goodsSkuId: this.detail.skuList[0].goods_sku_id,
          goodsNum: this.addCount
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  background-color: #f5f5f5;

  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  img {
    display: block;
    width: 100%;
  }

  .custom-indicator {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 6px 12px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    color: #fff;
    backdrop-filter: blur(5px);
  }

  .desc {
    width: 100%;
    overflow: scroll;
    background-color: #fff;
    padding: 15px;

    ::v-deep img {
      display: block;
      width: 100%!important;
      margin-bottom: 10px;
      border-radius: 8px;
    }
  }

  .info {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;

    .price {
      display: flex;
      align-items: baseline;
    }

    .now {
      color: #c21401;
      font-size: 24px;
      font-weight: 600;
      margin-right: 10px;
    }

    .oldprice {
      color: #999;
      font-size: 14px;
      text-decoration: line-through;
    }

    .sellcount {
      color: #999;
      font-size: 13px;
      padding-top: 4px;
    }
  }

  .msg {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 15px;
    color: #333;
  }

  .service {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #fafafa;
    border-radius: 8px;
    font-size: 13px;

    .left-words {
      display: flex;
      gap: 15px;

      span {
        display: flex;
        align-items: center;
        color: #666;
      }

      .van-icon {
        margin-right: 4px;
        color: #c21401;
        font-size: 14px;
      }
    }

    .right-icon {
      .van-icon {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .comment {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .comment-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    .right {
      color: #999;
      font-size: 14px;
      font-weight: normal;

      .van-icon {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }

  .comment-list {
    .comment-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .top {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .name {
          font-size: 14px;
          color: #666;
          margin-right: 10px;
        }
      }

      .content {
        font-size: 14px;
        line-height: 20px;
        color: #333;
        margin-bottom: 8px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 8px;

      &:hover {
        background-color: #f5f5f5;
        color: #c21401;
      }

      .van-icon {
        font-size: 24px;
        margin-bottom: 2px;
      }
    }

    .btn-add,
    .btn-buy {
      height: 38px;
      line-height: 38px;
      padding: 0 20px;
      border-radius: 20px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-add {
      background-color: #ffa900;
      margin-right: 10px;
    }

    .btn-buy {
      background-color: #c21401;
    }
  }
}

.tips {
  padding: 10px;
}

// 弹层的样式
.product {
  padding: 15px;

  .product-title {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    .left {
      margin-right: 15px;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        background-color: #f5f5f5;
      }
    }

    .right {
      flex: 1;

      .price {
        font-size: 14px;
        color: #c21401;
        margin-bottom: 8px;

        .nowprice {
          font-size: 26px;
          font-weight: 600;
          margin: 0 5px;
        }
      }

      .count {
        font-size: 13px;
        color: #999;
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    span:first-child {
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }
  }

  .showbtn {
    margin-top: 20px;
  }

  .btn, .btn-none {
    height: 44px;
    line-height: 44px;
    margin: 25px 0 10px;
    border-radius: 22px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn {
    background-color: #ffa900;

    &:hover {
      background-color: #ff9500;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 169, 0, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .btn.now {
    background-color: #c21401;

    &:hover {
      background-color: #a81201;
      box-shadow: 0 4px 12px rgba(194, 20, 1, 0.3);
    }
  }

  .btn-none {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}

.footer .icon-cart {
  position: relative;

  .num {
    z-index: 999;
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    background-color: #c21401;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}
</style>
