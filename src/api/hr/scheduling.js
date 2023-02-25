import request from '@/utils/request'

// 查询班次列表
export function listClasses(query) {
  return request({
    url: '/hr/classes/list',
    method: 'get',
    params: query
  })
}

// 查询班次详细
export function getClasses(id) {
  return request({
    url: '/hr/classes/' + id,
    method: 'get'
  })
}

// 新增班次
export function addClasses(data) {
  return request({
    url: '/hr/classes',
    method: 'post',
    data: data
  })
}

// 修改班次
export function updateClasses(data) {
  return request({
    url: '/hr/classes',
    method: 'put',
    data: data
  })
}

// 删除班次
export function delClasses(id) {
  return request({
    url: '/hr/classes/' + id,
    method: 'delete'
  })
}
