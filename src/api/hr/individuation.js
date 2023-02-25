import request from '@/utils/request'

export function get(data) {
  return request({
    url: '/individuation',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/individuation',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/individuation',
    method: 'put',
    data: data
  })
}

