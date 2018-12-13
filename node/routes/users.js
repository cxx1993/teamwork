const router = require('koa-router')()
const controller = require('../controller/user.js')


router.prefix('/user')

// 新增用户
router.post('/', controller.createUser)
// 删除用户
router.delete('/:id', controller.deleteUserById)
router.post('/deletes', controller.deleteUserMutiByIds)
// 更新用户
router.put('/:id', controller.updateUserById)
// 获取列表
router.get('/', controller.findList)

module.exports = router
