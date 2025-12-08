<template>
  <div class="category">
    <!-- 分类 -->
    <van-nav-bar title="全部分类" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请输入搜索关键词"
      @click="$router.push('/search')"
    />

    <!-- 分类列表 -->
    <div class="list-box">
      <div class="left">
        <ul>
          <li v-for="(item, index) in list" :key="item.category_id">
            <a :class="{ active: index === activeIndex }" @click="activeIndex = index" href="javascript:;">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <div class="right">
        <div @click="$router.push(`/searchlist?categoryId=${item.category_id}`)" v-for="item in list[activeIndex]?.children" :key="item.category_id" class="cate-goods">
          <img :src="item.image?.external_url" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategoryData } from '@/api/category'
export default {
  name: 'CategoryPage',
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      list: [],
      activeIndex: 0
    }
  },
  methods: {
    async getCategoryList () {
      const { data: { list } } = await getCategoryData()
      this.list = list
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.category {
  padding-top: 100px;
  padding-bottom: 50px;
  height: 100vh;
  background-color: #f8f8f8;

  .list-box {
    height: 100%;
    display: flex;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .left {
      width: 90px;
      height: 100%;
      background-color: #f5f5f5;
      overflow-y: auto;
      // 自定义滚动条
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        position: relative;

        a {
          display: block;
          height: 50px;
          line-height: 50px;
          text-align: center;
          color: #666;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          &.active {
            color: #c21401;
            background-color: #fff;
            font-weight: 500;
            // 添加左侧激活指示器
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 20px;
              background-color: #c21401;
              border-radius: 0 2px 2px 0;
            }
          }
          &:hover {
            color: #c21401;
            background-color: rgba(194, 20, 1, 0.05);
          }
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      padding: 15px;
      overflow-y: auto;

      // 自定义滚动条
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }

      .cate-goods {
        width: 31%;
        margin-bottom: 18px;
        padding: 10px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        img {
          width: 80px;
          height: 80px;
          display: block;
          margin: 0 auto 8px;
          object-fit: cover;
          border-radius: 4px;
          background-color: #f5f5f5;
        }

        p {
          text-align: center;
          font-size: 12px;
          color: #333;
          margin: 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
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
</style>
