<template>
  <div class="user">
    <div class="head-page" v-if="isLogin">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">{{ detail.mobile }}</div>
        <div class="vip">
          <van-icon name="diamond-o" />
          普通会员
        </div>
      </div>
    </div>

    <div v-else class="head-page" @click="$router.push('/login')">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">未登录</div>
        <div class="words">点击登录账号</div>
      </div>
    </div>

    <div class="my-asset">
      <div class="asset-left">
        <div class="asset-left-item">
          <span>{{ detail.pay_money || 0 }}</span>
          <span>账户余额</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>积分</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>优惠券</span>
        </div>
      </div>
      <div class="asset-right">
        <div class="asset-right-item">
          <van-icon name="balance-pay" />
          <span>我的钱包</span>
        </div>
      </div>
    </div>
    <div class="order-navbar">
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=all')">
        <van-icon name="balance-list-o" />
        <span>全部订单</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=payment')">
        <van-icon name="clock-o" />
        <span>待支付</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=delivery')">
        <van-icon name="logistics" />
        <span>待发货</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=received')">
        <van-icon name="send-gift-o" />
        <span>待收货</span>
      </div>
    </div>

    <div class="service">
      <div class="title">我的服务</div>
      <div class="content">
        <div class="content-item">
          <van-icon name="records" />
          <span>收货地址</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-o" />
          <span>领券中心</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-card-o" />
          <span>优惠券</span>
        </div>
        <div class="content-item">
          <van-icon name="question-o" />
          <span>我的帮助</span>
        </div>
        <div class="content-item">
          <van-icon name="balance-o" />
          <span>我的积分</span>
        </div>
        <div class="content-item">
          <van-icon name="refund-o" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>

    <div class="logout-btn">
     <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { getUserInfoDetail } from '@/api/user.js'
export default {
  name: 'UserPage',
  data () {
    return {
      detail: {}
    }
  },
  created () {
    if (this.isLogin) {
      this.getUserInfoDetail()
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.token
    }
  },
  methods: {
    async getUserInfoDetail () {
      const { data: { userInfo } } = await getUserInfoDetail()
      this.detail = userInfo
      // console.log(this.detail)
    },
    logout () {
      // 退出登录要添加确认提示
      this.$dialog.confirm({
        title: '温馨提示',
        message: '你确认要退出么'
      }).then(() => {
        // 退出是一个动作 => 包含了两步，分别是将 user 和 cart 进行重置
        this.$store.dispatch('user/logout')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 50px;
}

.head-page {
  height: 140px;
  background: linear-gradient(135deg, #c21401 0%, #ff4b2b 100%);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(194, 20, 1, 0.2);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #a81201 0%, #ff381a 100%);
  }

  .head-img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 16px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.info {
  .mobile {
    margin-bottom: 8px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .vip {
    display: inline-flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 4px 10px;
    border-radius: 12px;
    color: #ffd700;
    font-size: 13px;
    backdrop-filter: blur(5px);

    .van-icon {
      margin-right: 4px;
      font-size: 14px;
      color: #ffd700;
    }
  }

  .words {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}

.my-asset {
  display: flex;
  padding: 20px 0;
  font-size: 14px;
  background-color: #fff;
  margin: 15px 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .asset-left {
    display: flex;
    justify-content: space-evenly;
    flex: 3;
    border-right: 1px solid #f0f0f0;

    .asset-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-3px);
      }

      span:first-child {
        margin-bottom: 6px;
        color: #c21401;
        font-size: 18px;
        font-weight: 600;
      }

      span:last-child {
        color: #666;
        font-size: 13px;
      }
    }
  }

  .asset-right {
    flex: 1;

    .asset-right-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #fafafa;
        color: #c21401;
      }

      .van-icon {
        font-size: 26px;
        margin-bottom: 6px;
        transition: all 0.3s ease;
      }

      &:hover .van-icon {
        transform: scale(1.1);
      }
    }
  }
}

.order-navbar {
  display: flex;
  padding: 20px 0;
  margin: 0 10px 15px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .order-navbar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25%;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10px 0;
    border-radius: 8px;

    &:hover {
      background-color: rgba(194, 20, 1, 0.05);
      transform: translateY(-2px);
    }

    .van-icon {
      font-size: 28px;
      margin-bottom: 8px;
      color: #c21401;
      transition: all 0.3s ease;
    }

    span {
      color: #333;
      font-size: 13px;
      transition: color 0.3s ease;
    }

    &:hover .van-icon {
      transform: scale(1.1);
    }

    &:hover span {
      color: #c21401;
      font-weight: 500;
    }
  }
}

.service {
  font-size: 14px;
  background-color: #fff;
  border-radius: 10px;
  margin: 0 10px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }

  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px 0;

    .content-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      padding: 15px 0;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 8px;
      margin-bottom: 0;

      &:hover {
        background-color: rgba(194, 20, 1, 0.05);
        transform: translateY(-3px);
      }

      .van-icon {
        font-size: 28px;
        margin-bottom: 8px;
        color: #c21401;
        transition: all 0.3s ease;
      }

      span {
        color: #333;
        font-size: 13px;
        transition: color 0.3s ease;
      }

      &:hover .van-icon {
        transform: scale(1.1);
      }

      &:hover span {
        color: #c21401;
        font-weight: 500;
      }
    }
  }
}

.logout-btn {
  button {
    width: calc(100% - 20px);
    margin: 20px auto 0;
    display: block;
    font-size: 15px;
    color: #666;
    border-radius: 25px;
    border: 1px solid #dcdcdc;
    padding: 12px 0;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      background-color: #f5f5f5;
      border-color: #c21401;
      color: #c21401;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
