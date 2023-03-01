import request from '@/utils/request'

// 查询补卡录入列表
export function listSupplement(query) {
  return request({
    url: '/hr/supplement/list',
    method: 'get',
    params: query
  })
}

// 查询补卡录入详细
export function getSupplement(id) {
  return request({
    url: '/hr/supplement/' + id,
    method: 'get'
  })
}

// 新增补卡录入
export function addSupplement(data) {
  return request({
    url: '/hr/supplement',
    method: 'post',
    data: data
  })
}

// 修改补卡录入
export function updateSupplement(data) {
  return request({
    url: '/hr/supplement',
    method: 'put',
    data: data
  })
}

// 删除补卡录入
export function delSupplement(id) {
  return request({
    url: '/hr/supplement/' + id,
    method: 'delete'
  })
}
