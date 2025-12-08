import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证相关
      userInfo: getInfo()
    }
  },
  mutations: {
    // 所有的mutations中的方法第一个参数都是state
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})
      // 购物车信息要重置( 如何跨模块调用 mutation ？ 第三个参数传 { root: true } )
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
