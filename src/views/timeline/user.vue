<template>
  <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户ID" prop="id">
          <Input type="text" v-model="formCustom.id"></Input>
      </FormItem>
      <FormItem label="用户名" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
      </FormItem>
      <FormItem label="备注" prop="mark">
          <Input type="textarea" v-model="formCustom.mark"></Input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
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
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.type ? this.handleAdd() : this.handleUpdate() // eslint-disable-line
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    handleAdd() {

    },
    handleUpdate() {
      const { userId, formCustom } = this
      axios.put(`http://127.0.0.1:3000/user/${userId}`, formCustom).then(res => {
        console.log('/////')
      })
    },
  },
}
</script>
