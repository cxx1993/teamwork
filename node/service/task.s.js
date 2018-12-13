const Task = require('../model/task.m')
const _static = require('../utils/static')

const search = {
  match: {},
  skip: 0,
  limit: _static.list.limit,
}

module.exports = {
  // 新增一条数据
  addTask(params) {
    return new Promise((resolve) => {
      Task.create(params)
        .then(res => resolve({ code: 1, res }))
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },
  // 删除一条数据
  deleteTaskById(id) {
    return new Promise((resolve) => {
      Task.findByIdAndRemove(id)
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
  deleteMutiTaskByIds(ids) {
    return new Promise((resolve) => {
      Task.remove({ _id: { $in: ids } })
        .then(res => resolve({ code: 1, res }))
        .catch(err => resolve({ code: 0, msg: err.message }))
    })
  },
  // 修改一条数据
  // 返回更新后的数据
  updateTaskById(id, params) {
    return new Promise((resolve) => {
      Task.findByIdAndUpdate(id, params, { new: true })
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
   * 关联查询user表
   */
  findMutiByParams(params, field = '') {
    // const query = { ...search, ...q }
    // let {
    //   match, skip, page, limit,
    // } = query

    // if (page !== undefined) {
    //   skip = (page - 1) * limit
    // }

    return new Promise(((resolve) => {
      Task.aggregate([
        // {
        //   $match: match,
        // },
        // { $skip: skip },
        // { $limit: limit },
        // 关联查询users表
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        // $project：对数据进一步组合
        {
          $project: {
            title: 1,
            content: 1,
            start_time: 1,
            end_time: 1,
            create_time: 1,
            projectId: 1,
            userId: 1,
            username: '$user.username',
          },
        },
      ])
        .then(res => {
          const _res = res.map((v) => {
            const { username } = v
            v.username = username[0]  // eslint-disable-line
            return v
          })
          resolve({ code: 1, res: _res })
        })
        .catch(err => resolve({ code: 0, msg: err.message }))
    }))


    // return new Promise((resolve) => {
    //   Task.find(params, field)
    //     .then(res => {
    //       const data = {
    //         list: res,
    //         length: res.length,
    //       }
    //       resolve({ code: 1, res: data })
    //     })
    //     .catch(err => resolve({ code: 0, msg: err.message }))
    // })
  },

}
