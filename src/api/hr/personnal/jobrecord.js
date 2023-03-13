import request from '@/utils/request'

// 查询工作经历列表
export function listJobrecord(query) {
  return request({
    url: '/jobrecord',
    method: 'get',
    params: query
  })
}

// 查询工作经历详细
export function getJobrecord(id) {
  return request({
    url: '/jobrecord/' + id,
    method: 'get'
  })
}

// 新增工作经历
export function addJobrecord(data) {
  return request({
    url: '/jobrecord',
    method: 'post',
    data: data
  })
}

// 修改工作经历
export function updateJobrecord(data) {
  return request({
    url: '/jobrecord',
    method: 'put',
    data: data
  })
}

// 删除工作经历
export function delJobrecord(id) {
  return request({
    url: '/jobrecord',
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
