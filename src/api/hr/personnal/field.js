import request from '@/utils/request'

// 查询自定义字段列表
export function pageField(query) {
  return request({
    url: '/field/page',
    method: 'get',
    params: query
  })
}

export function listField(tableId) {
    return request({
      url: `/field/list/${tableId}`,
      method: 'get'
    })
  }

// 查询自定义字段列表
export function saveVal(map) {
    return request({
      url: '/customFieldValue',
      method: 'post',
      params: map
    })
}

export function listFieldVal(userId) {
    return request({
      url: '/customFieldValue/' + userId,
      method: 'get'
    })
  }

// 查询自定义字段详细
export function getField(id) {
  return request({
    url: '/field/' + id,
    method: 'get'
  })
}

// 新增或修改自定义字段
export function saveField(data) {
  return request({
    url: '/field',
    method: 'post',
    data: data
  })
}

export function updateField(data) {
    return request({
      url: '/field',
      method: 'put',
      data: data
    })
  }

// 删除自定义字段
export function delField(id) {
  return request({
    url: '/field/' + id,
    method: 'delete'
  })
}
