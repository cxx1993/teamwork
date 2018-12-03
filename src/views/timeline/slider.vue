<template>
  <div id='timeline-slider'>
      <template v-for='(item, key) in store_getUser'>
        <div class='avatar-container' :key='key'>
          <Avatar size='large'>{{item.username}}</Avatar>
          <span>{{item.username}}</span>
        </div>
      </template>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      store_getUser: 'getUser',
    }),
  },
  data() {
    return {

    }
  },
}
</script>

<style lang='scss'>

</style>
