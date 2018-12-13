<template>
  <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户ID" prop="id" v-show="type">
          <Input type="text" v-model="formCustom.id"></Input>
      </FormItem>
      <FormItem label="用户名" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
      </FormItem>
      <FormItem label="备注" prop="mark">
          <Input type="textarea" v-model="formCustom.mark"></Input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit">Submit</Button>
          <Button @click="handleReset" style="margin-left: 8px">Reset</Button>
      </FormItem>
  </Form>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      type: 0,
      userId: '',
      formCustom: {
        id: '',
        username: '',
        mark: '',
      },
      ruleCustom: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
        ],
        // mark: [
        //   { validator: validateAge, trigger: 'blur' },
        // ],
      },
    }
  },
  methods: {
    addInit({ type }) {
      this.userId = ''
      this.type = type
    },
    updateInit({ type, userId }) {
      this.userId = userId
      this.type = type
      axios.get(`http://127.0.0.1:3000/user/${userId}`).then(res => {
        this.formCustom = res.data
      })
    },
    handleSubmit() {
      this.$refs.formCustom.validate((valid) => {
        if (valid) {
          this.type ? this.handleUpdate() : this.handleAdd() // eslint-disable-line
        }
      })
    },
    handleReset() {
      this.$refs.formCustom.resetFields()
    },
    handleAdd() {
      const { formCustom } = this
      delete formCustom.id
      axios.post('http://127.0.0.1:3000/user', formCustom).then(res => {
        this.$Message.success('新增成功')
        this.$emit('close', false)
        // todo:修改store
      })
    },
    handleUpdate() {
      const { userId, formCustom } = this
      axios.put(`http://127.0.0.1:3000/user/${userId}`, formCustom).then(res => {
        this.$Message.success('修改成功')
        this.$emit('close', false)
        // todo:修改store
      })
    },
  },
}
</script>
