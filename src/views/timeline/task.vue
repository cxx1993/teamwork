<template>
  <Form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="80"
  >
    <FormItem
      label="标题"
      prop="title"
    >
      <Input
        v-model="formValidate.title"
        placeholder="Enter your title"
      ></Input>
    </FormItem>

    <FormItem
      label="用户"
      prop="userId"
    >
      <Input
        v-model="formValidate.userId"
        placeholder="Enter your userId"
      ></Input>
    </FormItem>

    <FormItem
      label="项目组"
      prop="groupId"
    >
      <Input
        v-model="formValidate.groupId"
        placeholder="Enter your groupId"
      ></Input>
    </FormItem>
    <FormItem
      label="时间区间"
      prop="dateRange"
    >
      <DatePicker
        type="daterange"
        v-model='dateRange'
        split-panels
        placeholder="选择区间"
        style="width: 100%"
        placement="bottom-end"
      />
    </FormItem>

    <FormItem
      label="备注"
      prop="content"
    >
      <Input
        type='textarea'
        v-model="formValidate.content"
        placeholder="请输入备注..."
      ></Input>
    </FormItem>

    <FormItem>
      <Button
        type="primary"
        @click="handleSubmit"
      >Submit</Button>
      <Button
        @click="handleReset"
        style="margin-left: 8px"
      >Reset</Button>
      <Button
        v-show='type'
        @click="handleDelete"
        style="margin-left: 8px"
      >delete</Button>
    </FormItem>
  </Form>
</template>
<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      type: 0, // 0:新增 1:修改
      taskId: '',
      userId: '',
      dateRange: ['', ''],
      formValidate: {
        id: '',
        userId: '',
        start_time: '',
        end_time: '',
        title: '',
        content: '',
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    ...mapMutations({
      store_curdTask: 'curdTask',
    }),
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.type ? this.handleUpdateTask():this.handleAddTask()  //eslint-disable-line
        }
      })
    },
    // 重置表单
    handleReset() {
      this.$refs.formValidate.resetFields()
      this.dateRange = ['', '']
    },
    addInit(userId) {
      this.formValidate.userId = userId
      this.type = 0
    },
    updateInit(taskId) {
      // 根据taskId获取数据
      this.taskId = taskId
      this.type = 1
      axios.get(`http://127.0.0.1:3000/task/${taskId}`).then(res => {
        this.formValidate = res.data
        this.dateRange = [res.data.start_time, res.data.end_time]
      })
    },
    // 修改task
    handleUpdateTask() {
      const {
        formValidate, userId, groupId, dateRange, taskId,
      } = this
      formValidate.start_time = dateRange[0]
      formValidate.end_time = dateRange[1]
      axios
        .put(`http://127.0.0.1:3000/task/${taskId}`, { ...formValidate })
        .then(res => {
          this.store_curdTask({ data: res.data, type: 'update' })
          this.$Message.success('修改成功！')
          this.$emit('close', false)
          this.handleReset()
        })
        .catch(err => {
          this.$Message.error('修改出错！')
        })
    },
    // 新增task
    handleAddTask() {
      const {
        formValidate, userId, groupId, dateRange,
      } = this
      formValidate.start_time = dateRange[0]
      formValidate.end_time = dateRange[1]
      axios
        .post('http://127.0.0.1:3000/task', formValidate)
        .then(res => {
          this.$Message.success(res.msg || '新增成功！')
          this.$emit('close', false)
          this.handleReset()
          this.store_curdTask({ data: res.data, type: 'add' })
        })
        .catch(err => {
          this.$Message.error(err.message || '新增出错！')
        })
    },
    // 删除task
    handleDelete() {
      const {
        formValidate: {
          id,
          userId,
        },
      } = this
      axios.delete(`http://127.0.0.1:3000/task/${id}`).then(res => {
        this.$Message.error(res.message || '删除成功！')
        this.$emit('close', false)
        this.handleReset()
        this.store_curdTask({ data: { id, userId }, type: 'remove' })
      }).catch(err => {
        this.$Message.error(err.message || '删除出错！')
      })
    },
  },
}
</script>
