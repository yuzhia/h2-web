import request from '@/utils/request'

// 查询请假录入列表
export function listEntry(query) {
  return request({
    url: '/hr/entry/list',
    method: 'get',
    params: query
  })
}

// 查询请假录入详细
export function getEntry(id) {
  return request({
    url: '/hr/entry/' + id,
    method: 'get'
  })
}

// 新增请假录入
export function addEntry(data) {
  return request({
    url: '/hr/entry',
    method: 'post',
    data: data
  })
}

// 修改请假录入
export function updateEntry(data) {
  return request({
    url: '/hr/entry',
    method: 'put',
    data: data
  })
}

// 删除请假录入
export function delEntry(id) {
  return request({
    url: '/hr/entry/' + id,
    method: 'delete'
  })
}
