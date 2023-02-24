import request from '@/utils/request'

// 查询薪资异动列表
export function listChange(query) {
  return request({
    url: '/salary/change/list',
    method: 'get',
    params: query
  })
}

// 查询薪资异动详细
export function getChange(id) {
  return request({
    url: '/salary/change/' + id,
    method: 'get'
  })
}

// 新增薪资异动
export function addChange(data) {
  return request({
    url: '/salary/change',
    method: 'post',
    data: data
  })
}

// 修改薪资异动
export function updateChange(data) {
  return request({
    url: '/salary/change',
    method: 'put',
    data: data
  })
}

// 删除薪资异动
export function delChange(id) {
  return request({
    url: '/salary/change/' + id,
    method: 'delete'
  })
}
