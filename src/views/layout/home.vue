<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar title="掌上优购商城" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请在此输入搜索关键词"
      @click="$router.push('/search')"
    />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in bannerList" :key="item.imgUrl">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="item in navList" :key="item.imgUrl"
        :icon="item.imgUrl"
        text="新品首发"
        @click="$router.push('/category')"
      />
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img src="@/assets/main.png" alt="">
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>

      <div class="goods-list">
        <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getHomeData } from '@/api/home'
export default {
  name: 'HomePage',
  components: {
    GoodsItem
  },
  data () {
    return {
      bannerList: [], // 轮播
      navList: [], // 导航
      proList: [] // 商品
    }
  },
  async created () {
    const { data: { pageData } } = await getHomeData()
    this.bannerList = pageData.items[1].data
    this.navList = pageData.items[3].data
    this.proList = pageData.items[6].data
    // console.log(this.proList)
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.home {
  padding-top: 100px;
  padding-bottom: 50px;
  background-color: #f8f8f8;
}

// 导航条样式定制
.van-nav-bar {
  z-index: 999;
  background-color: #c21401;
  box-shadow: 0 2px 8px rgba(194, 20, 1, 0.2);
  ::v-deep .van-nav-bar__title {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 92%;
  left: 4%;
  top: 56px;
  z-index: 999;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  ::v-deep .van-field__control {
    font-size: 14px;
  }
}

// 轮播图部分
.my-swipe {
  margin: 0 16px;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  .van-swipe-item {
    height: 185px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    background-color: #39a9ed;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// 导航网格部分
.van-grid {
  margin: 16px 0;
  padding: 0 8px;
  background-color: #fff;
  .van-grid-item {
    padding: 12px 0;
    ::v-deep .van-grid-item__content {
      padding: 0;
    }
    ::v-deep .van-grid-item__icon {
      margin-bottom: 8px;
    }
    ::v-deep .van-grid-item__text {
      font-size: 12px;
      color: #333;
      font-weight: 500;
    }
  }
}

// 主会场
.main {
  padding: 0 16px;
  margin-bottom: 16px;
  img {
    display: block;
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.02);
    }
  }
}

// 猜你喜欢
.guess {
  background-color: #fff;
  padding-bottom: 16px;
  .guess-title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    position: relative;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 80px;
      height: 1px;
      background-color: #e0e0e0;
    }
    &::before {
      left: 50px;
    }
    &::after {
      right: 50px;
    }
  }

  // 商品样式
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 8px;
    gap: 12px;
    background-color: #fff;
  }
}
</style>
