<template>
  <div class="calender">
    <!-- <kalendar :configuration="calendar_settings" :appointments="appointments">

    </kalendar> -->
    calender
  </div>
</template>

<script>
// import { Kalendar } from 'kalendar-vue';
// import 'kalendar-vue/dist/KalendarVue.css';

export default {
  data: () => ({
    appointments: [],
    calendar_settings: {
      style: 'material_design', // ['flat_design', 'material_design']
      view_type: 'Month', // ['Month', 'Day']
      split_value: 20, // Value % 60 === 0
      cell_height: 20, // !isNaN(Value)
      scrollToNow: true, // Boolean
      current_day: new Date(), // Valid date
    },
  }),
  components: {
    // Kalendar,
  },
}
</script>

<style>

</style>
