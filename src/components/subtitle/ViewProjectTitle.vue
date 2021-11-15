<template>
  <span>{{title}}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  props:{
    title:String
  }
})
</script>
