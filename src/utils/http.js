import axios from 'axios'
import qs from 'qs'

const instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.baseURL = '/'
instance.defaults.timeout = 20 * 1000

instance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject({ respCode: '-1', respMsg: error.message || '请求出错' })
})

instance.interceptors.response.use((response) => {
  console.log(response)
  const { status, data } = response
  if (status !== 200) {
    return Promise.reject({ respCode: '-1', respMsg: `服务器${status}错误` })
  }
  const { body } = data
  return Promise.resolve(body)
}, (error) => {
  return Promise.reject({ respCode: '-1', respMsg: error.message || '结果出错' })
})

export function get(url, data) {
  const params = data || {}
  return instance({
    method: 'GET',
    url,
    params,
    paramsSerializer: param => qs.stringify(param, { arrayFormat: 'brackets' }),
  })
}

function makeRequest(method) {
  return function _doRequest(url, data) {
    const _data = qs.stringify(data)
    return instance({
      method, url, data: _data,
    })
  }
}

export const post = makeRequest('POST')
export const put = makeRequest('PUT')
export const del = makeRequest('DELETE')
