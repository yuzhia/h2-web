import request from '@/utils/request'

// 查询出差录入列表
export function listTravel(query) {
  return request({
    url: '/hr/travel/list',
    method: 'get',
    params: query
  })
}

// 查询出差录入详细
export function getTravel(id) {
  return request({
    url: '/hr/travel/' + id,
    method: 'get'
  })
}

// 新增出差录入
export function addTravel(data) {
  return request({
    url: '/hr/travel',
    method: 'post',
    data: data
  })
}

// 修改出差录入
export function updateTravel(data) {
  return request({
    url: '/hr/travel',
    method: 'put',
    data: data
  })
}

// 删除出差录入
export function delTravel(id) {
  return request({
    url: '/hr/travel/' + id,
    method: 'delete'
  })
}
