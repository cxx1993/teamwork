<template>
  <div id='timeline-slider'>
      <template v-for='(item, key) in groups'>
        <div class='avatar-container' :key='key'>
          <Avatar size='large'>{{item.title}}</Avatar>
          <span>{{item.title}}</span>
        </div>
      </template>
  </div>
</template>

<script>


export default {
  props: ['groups'],
  data() {
    return {

    }
  },
}
</script>

<style lang='scss'>

</style>
