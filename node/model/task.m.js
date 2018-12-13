/**
 * 任务 模型
 * @author：chenxin
 */

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')


const ObjectId = mongoose.Schema.ObjectId

const Task = new mongoose.Schema({
  title: { // 任务名
    type: String,
  },
  userId: {
    type: ObjectId, // 关联用户id
    ref: 'user', // 映射到users表
  },
  projectId: {
    type: ObjectId, // 关联项目id
    ref: 'project', // 映射到project表
  },
  content: {
    type: String, // 任务内容
  }, // 内容
  start_time: {
    // 开始时间
    type: Date,
  },
  end_time: {
    // 结束时间
    type: Date,
  },
  create_time: {
    // 记录生成时间
    type: Date,
    default: Date.now,
  },
})

Task.plugin(mongoosePaginate)

module.exports = mongoose.model('task', Task)
