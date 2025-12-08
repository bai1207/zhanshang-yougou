export default {
  // 此处编写的是 vue组件实例的配置项，通过一定语法，可以直接混入到组件内
  // data methods computed 生命周期函数 ...
  // 注意点：
  // 如果此处 和组件内，提供了同名的 data 或 methods， 则组件内优先级更高
  // 如果编写了生命周期函数，则mixins中的生命周期函数 和 页面的生命周期函数，会用数组管理统一执行
  methods: {
    loginConfirm () {
      // 判断 token 是否存在
      // 1. 如果 token 不存在，弹确认框 返回true
      // 2. 如果 token 存在，返回false
      if (!this.$store.getters.token) {
        // 弹确认框
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哦',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 如果希望，跳转到登录 => 登录后能回跳回来，需要在跳转的时候携带参数
            // this.$route.fullPath 会包含查询参数
            // 不向浏览器历史记录中添加新纪录，而是替换当前的历史记录。当用户点击浏览器的
            // 后退按钮时，会直接跳过当前页面，回到上上个页面
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}
