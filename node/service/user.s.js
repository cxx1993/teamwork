const User = require('../model/user.m')
const _static = require('../utils/static')

const search = {
  match: {},
  skip: 0,
  limit: _static.list.limit,
}

module.exports = {
  // 新增一条数据
  addUser(params) {
    return new Promise((resolve, reject) => {
      User.create(params)
        .then(res => resolve({ code: 1, res }))
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },
  // 删除一条数据
  deleteUserById(id) {
    return new Promise((resolve, reject) => {
      User.findByIdAndRemove(id)
        .then(res => {
          if (res === null) {
            throw new Error('用户不存在')
          }
          resolve({ code: 1, res })
        })
        .catch(err => {
          resolve({ code: 0, msg: err.message })
        })
    })
  },
  // 删除多条数据
  deleteMutiUserByIds(ids) {
    return new Promise((resolve, reject) => {
      User.remove({ _id: { $in: ids } })
        .then(res => resolve({ code: 1, res }))
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },
  // 修改一条数据
  // 返回更新后的数据
  updateUserById(id, params) {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, params, { new: true })
        .then(res => {
          if (res === null) {
            throw new Error('用户不存在')
          }
          resolve({ code: 1, res })
        })
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },
  /**
   * 查找多个by 参数
   * params：查询条件
   * field：筛选需要返回的字段（不传返回所有）
   */
  findMutiByParams(params, field = '', query = {}, page) {
    let { pagesize, sort, limit } = page
    limit = limit || search.limit
    const skip = limit * pagesize
    // if (isNaN(pagesize)) {
    //   skip = 0
    // }

    return new Promise((resolve, reject) => {
      User.find(params, field).skip()
        .then(res => {
          const data = {
            list: res,
            length: res.length,
          }
          resolve({ code: 1, res: data })
        })
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },

}
