import request from '@/utils/request'

const baseUrl = '/periods'

// 查询【请填写功能名称】列表
export function listPeriods(query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getPeriods(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addPeriods(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updatePeriods(data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delPeriods(id) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
