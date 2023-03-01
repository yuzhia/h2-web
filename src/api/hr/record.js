import request from '@/utils/request'

// 查询考勤记录列表
export function listRecord(query) {
  return request({
    url: '/attendanceRecord',
    method: 'get',
    params: query
  })
}

// 查询考勤记录详细
export function getRecord(id) {
  return request({
    url: '/hr/record/' + id,
    method: 'get'
  })
}

// 新增考勤记录
export function addRecord(data) {
  return request({
    url: '/hr/record',
    method: 'post',
    data: data
  })
}

// 修改考勤记录
export function updateRecord(data) {
  return request({
    url: '/hr/record',
    method: 'put',
    data: data
  })
}

// 删除考勤记录
export function delRecord(id) {
  return request({
    url: '/hr/record/' + id,
    method: 'delete'
  })
}
