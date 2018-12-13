// 引入 service 文件
const Service = require('../service/task.s')

module.exports = {
  // 新增用户
  async createTask(ctx, next) {
    const params = ctx.request.body
    const res = await Service.addTask(params)
    ctx.body = res
  },
  // 删除一个用户 by Id
  async deleteTaskById(ctx, next) {
    const { id } = ctx.params
    if (!id) {
      ctx.body = {
        code: 0,
        msg: 'id缺失',
      }
    }
    const res = await Service.deleteTaskById(id)
    ctx.body = res
  },
  // 删除一个用户 by Ids
  // ids输入的是‘xxx,yyy,zzz’string类型，在后端转为array
  async deleteTaskMutiByIds(ctx, next) {
    const { ids } = ctx.request.body
    try {
      if (!ids) {
        throw new Error('ids不存在')
      }
      const params = ids.split(',')
      const res = await Service.deleteMutiTaskByIds(params)
      ctx.body = res
    } catch (err) {
      ctx.body = {
        code: 0,
        err: err.message || err,
      }
    }
  },
  async updateTaskById(ctx, next) {
    const { id } = ctx.params
    const params = ctx.request.body
    const res = await Service.updateTaskById(id, params)
    ctx.body = res
  },
  // 查找列表
  async findList(ctx, next) {
    const params = {}
    const res = await Service.findMutiByParams(params)
    ctx.body = res
  },


}
