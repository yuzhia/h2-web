import request from '@/utils/request'

// 查询员工合同列表
export function listContact(query) {
  return request({
    url: '/contact',
    method: 'get',
    params: query
  })
}

// 查询员工合同详细
export function getContact(id) {
  return request({
    url: '/contact/' + id,
    method: 'get'
  })
}

// 新增员工合同
export function addContact(data) {
  return request({
    url: '/contact',
    method: 'post',
    data: data
  })
}

// 修改员工合同
export function updateContact(data) {
  return request({
    url: '/contact',
    method: 'put',
    data: data
  })
}

// 删除员工合同
export function delContact(id) {
  return request({
    url: '/contact',
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
