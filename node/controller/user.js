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
  // 查找列表
  async findList(ctx, next) {
    const params = {}
    const res = await Service.findMutiByParams(params)
    ctx.body = res
  },


}
