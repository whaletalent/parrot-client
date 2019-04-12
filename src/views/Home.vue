<template>
  <v-app dark id="inspire">
    <v-content>
      <LoginCard/>
    </v-content>
  </v-app>
</template>

<script>
import LoginCard from '@/components/LoginCard.vue'
  export default {
    components:{
      LoginCard
    }
  }
</script>