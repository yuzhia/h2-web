import request from '@/utils/request'

const baseUrl = '/company'

// 查询公司列表
export function listCompany(query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: query
  })
}

// 查询公司详细
export function getCompany(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 新增公司
export function addCompany(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

// 修改公司
export function updateCompany(data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })
}

// 删除公司
export function delCompany(id) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
