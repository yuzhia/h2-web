import request from '@/utils/request'

const baseUrl = '/train'

// 查询员工培训记录列表
export function listTrain(query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: query
  })
}

// 查询员工培训记录详细
export function getTrain(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 新增员工培训记录
export function addTrain(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

// 修改员工培训记录
export function updateTrain(data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })
}

// 删除员工培训记录
export function delTrain(id) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
