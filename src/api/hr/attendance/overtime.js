import request from '@/utils/request'

// 查询加班条录入列表
export function listNote(query) {
  return request({
    url: '/hr/note/list',
    method: 'get',
    params: query
  })
}

// 查询加班条录入详细
export function getNote(id) {
  return request({
    url: '/hr/note/' + id,
    method: 'get'
  })
}

// 新增加班条录入
export function addNote(data) {
  return request({
    url: '/hr/note',
    method: 'post',
    data: data
  })
}

// 修改加班条录入
export function updateNote(data) {
  return request({
    url: '/hr/note',
    method: 'put',
    data: data
  })
}

// 删除加班条录入
export function delNote(id) {
  return request({
    url: '/hr/note/' + id,
    method: 'delete'
  })
}
