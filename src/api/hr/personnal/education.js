import request from '@/utils/request'

const baseUrl = '/education'

// 查询员工教育经历列表
export function listEducation(query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: query
  })
}

// 查询员工教育经历详细
export function getEducation(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 新增员工教育经历
export function addEducation(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

// 修改员工教育经历
export function updateEducation(data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })
}

// 删除员工教育经历
export function delEducation(id) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
