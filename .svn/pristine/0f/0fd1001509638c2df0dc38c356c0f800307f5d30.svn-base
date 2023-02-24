import request from '@/utils/request'

export const addWorkFlow = data => {
  return request({
    url: '/workFlow',
    method: 'post',
    data: data
  })
}

export const updateWorkFlow = data => {
  return request({
    url: '/workFlow',
    method: 'put',
    data: data
  })
}

export const listWorkFlow = () => {
  return request({
    url: '/workFlow',
    method: 'get'
  })
}

export const getWorkFlow = id => {
  return request({
    url: `/workFlow/get`,
    method: 'get',
    params: { id }
  })
}

export const deleteWorkFlow = id => {
  return request({
    url: `/workFlow/${id}`,
    method: 'delete'
  })
}
