import request from './request'

export function login(name: string) {
  return request({
    url: '/login',
    method: 'post',
    data: { "name": name }
  })
}
export function chat() {
  return request({
    url: '/chat',
    method: 'get'
  })
}

export function ask() {
  return request({
    url: '/ask',
    method: 'get',
  })
}

export function disconnect() {
  return request({
    url: '/disconnect',
    method: 'get',
  })
}