import request from '@/utils/request'

// 查询专业技术等级证书列表
export function listCert(query) {
  return request({
    url: '/techCert',
    method: 'get',
    params: query
  })
}

// 查询专业技术等级证书详细
export function getCert(id) {
  return request({
    url: '/techCert/' + id,
    method: 'get'
  })
}

// 新增专业技术等级证书
export function addCert(data) {
  return request({
    url: '/techCert',
    method: 'post',
    data: data
  })
}

// 修改专业技术等级证书
export function updateCert(data) {
  return request({
    url: '/techCert',
    method: 'put',
    data: data
  })
}

// 删除专业技术等级证书
export function delCert(id) {
  return request({
    url: '/techCert',
    method: 'delete',
    params: { ids: [...id] + '' }
  })
}
