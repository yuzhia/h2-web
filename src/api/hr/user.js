import request from '@/utils/request'

// 查询排班与用户的中间列表
export function listUser(query) {
  return request({
    url: '/hr/user/list',
    method: 'get',
    params: query
  })
}

// 查询排班与用户的中间详细
export function getUser(id) {
  return request({ 
    url: '/hr/user/' + id,
    method: 'get'
  })
}

// 新增排班与用户的中间
export function addUser(data) {
  return request({
    url: '/hr/user',
    method: 'post',
    data: data
  })
}

// 修改排班与用户的中间
export function updateUser(data) {
  return request({
    url: '/hr/user',
    method: 'put',
    data: data
  })
}

// 删除排班与用户的中间
export function delUser(id) {
  return request({
    url: '/hr/user/' + id,
    method: 'delete'
  })
}
