import request from '@/utils/request'

// 查询员工证件列表
export function listCertificate(query) {
  return request({
    url: '/certificate',
    method: 'get',
    params: query
  })
}

// 查询员工证件详细
export function getCertificate(id) {
  return request({
    url: '/certificate/' + id,
    method: 'get'
  })
}

// 新增员工证件
export function addCertificate(data) {
  return request({
    url: '/certificate',
    method: 'post',
    data: data
  })
}

// 修改员工证件
export function updateCertificate(data) {
  return request({
    url: '/certificate',
    method: 'put',
    data: data
  })
}

// 删除员工证件
export function delCertificate(id) {
  return request({
    url: '/certificate',
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
