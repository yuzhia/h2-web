import request from '@/utils/request'

// 查询员工关系列表
export function listRelation(query) {
  return request({
    url: '/relation',
    method: 'get',
    params: query,
  })
}

// 查询员工关系详细
export function getRelation(id) {
  return request({
    url: '/relation/' + id,
    method: 'get',
  })
}

// 新增员工关系
export function addRelation(data) {
  return request({
    url: '/relation',
    method: 'post',
    data: data,
  })
}

// 修改员工关系
export function updateRelation(data) {
  return request({
    url: '/relation',
    method: 'put',
    data: data,
  })
}

// 删除员工关系
export function delRelation(ids) {
  return request({
    url: '/relation',
    method: 'delete',
    params: { ids: [...ids] + '' },
  })
}
