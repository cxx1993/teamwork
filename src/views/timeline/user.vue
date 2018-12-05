<template>
  <div>
    {{userId}}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userId: ''
    }
  },
  methods: {
    addInit() {
      this.userId = ''
    },
    updateInit(userId) {
      this.userId = userId
    }
  }
}
</script>
