import request from '@/utils/request'

const baseUrl = '/temporary'

// 查询员工暂住证资料列表
export function listTemporary(query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: query
  })
}

// 查询员工暂住证资料详细
export function getTemporary(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 新增员工暂住证资料
export function addTemporary(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

// 修改员工暂住证资料
export function updateTemporary(data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })
}

// 删除员工暂住证资料
export function delTemporary(id) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
