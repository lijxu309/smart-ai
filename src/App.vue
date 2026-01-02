<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.initAuth()
})
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles are in style.css */
</style>
