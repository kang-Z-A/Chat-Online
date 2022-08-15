import request from './request'

export function login(name:string) {
  return request({
    url: '/login',
    method: 'post',
    data:{"name":name}
  })
}
