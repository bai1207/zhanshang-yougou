import request from '@/utils/request'

// 获取地址列表
export const getAddressList = () => {
  return request.post('/address/list')
}
