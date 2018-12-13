const router = require('koa-router')()
const controller = require('../controller/task.js')


router.prefix('/task')

// 新增用户
router.post('/', controller.createTask)
// 删除用户
router.delete('/:id', controller.deleteTaskById)
router.post('/deletes', controller.deleteTaskMutiByIds)
// 更新用户
router.put('/:id', controller.updateTaskById)
// 获取列表
router.get('/', controller.findList)

module.exports = router
