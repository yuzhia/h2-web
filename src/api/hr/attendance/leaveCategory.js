import request from '@/utils/request'

// 查询假期类别列表
export function listCategory(query) {
  return request({
    url: '/hr/category/list',
    method: 'get',
    params: query
  })
}

// 查询假期类别详细
export function getCategory(id) {
  return request({
    url: '/hr/category/' + id,
    method: 'get'
  })
}

// 新增假期类别
export function addCategory(data) {
  return request({
    url: '/hr/category',
    method: 'post',
    data: data
  })
}

// 修改假期类别
export function updateCategory(data) {
  return request({
    url: '/hr/category',
    method: 'put',
    data: data
  })
}

// 删除假期类别
export function delCategory(id) {
  return request({
    url: '/hr/category/' + id,
    method: 'delete'
  })
}
