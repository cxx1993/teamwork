// 引入 service 文件
const Service = require('../service/user.s.js')

module.exports = {
  // 新增用户
  async createUser(ctx, next) {
    const params = ctx.request.body
    const res = await Service.addUser(params)
    ctx.body = res
  },
  // 删除一个用户 by Id
  async deleteUserById(ctx, next) {
    const { id } = ctx.params
    if (!id) {
      ctx.body = {
        code: 0,
        msg: 'id缺失',
      }
    }
    const res = await Service.deleteUserById(id)
    ctx.body = res
  },
  // 删除一个用户 by Ids
  // ids输入的是‘xxx,yyy,zzz’string类型，在后端转为array
  async deleteUserMutiByIds(ctx, next) {
    const { ids } = ctx.request.body
    try {
      if (!ids) {
        throw new Error('ids不存在')
      }
      const params = ids.split(',')
      const res = await Service.deleteMutiUserByIds(params)
      ctx.body = res
    } catch (err) {
      ctx.body = {
        code: 0,
        err,
      }
    }
  },
  async updateUserById(ctx, next) {
    const { id } = ctx.params
    const params = ctx.request.body
    const res = await Service.updateUserById(id, params)
    ctx.body = res
  },
  /**
   * 查找列表
   * 支持 username模糊查询，create_time时间段查询，create_time（升序1/降序0），role，gender
   * pagesize分页页数，limit分页条数
   * field：显示需要返回的字段(不填返回所有) eg：{password : 0,role: 1}
   */
  async findList(ctx, next) {
    const { query } = ctx.request
    const params = {}
    try {
      const {
        pagesize, username, sort, limit, sTime, eTime, role, gender, field,
      } = query
      const _or = [] // push需要查询的对象
      let _and = [] // 范围查询
      // ====query start====
      if (username) { // 模糊查询username
        _or.push({ username: { $regex: username, $options: '$i' } })
      }
      if (role) {
        _or.push({ role })
      }
      if (gender) {
        _or.push({ gender })
      }
      if (sTime && eTime) {
        _and = [{ create_time: { $gt: sTime } }, { create_time: { $lt: eTime } }]
      }
      // ====分页 start====
      if (_or.length) query.$or = _or
      if (_and.length) query.$and = _and

      const res = await Service.findMutiByParams(params, field, query, { pagesize, sort, limit })
      ctx.body = res
    } catch (err) {
      ctx.body = {
        code: 0,
        msg: err.message,
      }
    }
  },


}
