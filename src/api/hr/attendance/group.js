import request from '@/utils/request'

// 查询班组信息列表
export function listGroup(query) {
  return request({
    url: '/hr/group/list',
    method: 'get',
    params: query
  })
}

// 查询班组信息详细
export function getGroup(id) {
  return request({
    url: '/hr/group/' + id,
    method: 'get'
  })
}

// 新增班组信息
export function addGroup(data) {
  return request({
    url: '/hr/group',
    method: 'post',
    data: data
  })
}

// 修改班组信息
export function updateGroup(data) {
  return request({
    url: '/hr/group',
    method: 'put',
    data: data
  })
}

// 删除班组信息
export function delGroup(id) {
  return request({
    url: '/hr/group/' + id,
    method: 'delete'
  })
}
