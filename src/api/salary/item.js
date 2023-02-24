import request from '@/utils/request'

// 查询薪资项目列表
export function listItem(query) {
  return request({
    url: '/salary/item/list',
    method: 'get',
    params: query
  })
}

// 查询薪资项目详细
export function getItem(id) {
  return request({
    url: '/salary/item/' + id,
    method: 'get'
  })
}

// 新增薪资项目
export function addItem(data) {
  return request({
    url: '/salary/item',
    method: 'post',
    data: data
  })
}

// 修改薪资项目
export function updateItem(data) {
  return request({
    url: '/salary/item',
    method: 'put',
    data: data
  })
}

// 删除薪资项目
export function delItem(id) {
  return request({
    url: '/salary/item/' + id,
    method: 'delete'
  })
}

// 查询出所有固定类型的数据
export function getItemType() {
  return request({
    url: '/salary/item/getItemType',
    method: 'get'
  })
}

