<template>
  <nav class="fixed top-0 left-0 space-x-4 h-12 w-full text-xl p-3 flex items-center
    justify-between bg-[#567bf5]">
    <!-- Desktop navigation -->
    <div class="hidden md:flex w-full justify-between">
      <div class="flex space-x-4">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/stuff">Stuff</RouterLink>
        <RouterLink to="/encyclopedia">Encyclopedia</RouterLink>
      </div>
      <div class="flex gap-5 right-0">
        <div class="">
          <select v-model="commonStore.locale" @change="commonStore.setLocale(commonStore.locale)" name="locale">
            <option value="fr">🇫🇷</option>
            <option value="en">🇬🇧</option>
            <option value="es">🇪🇸</option>
            <option value="pt">🇵🇹</option>
          </select>
        </div>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </div>

    <!-- Mobile navigation -->
    <div class="md:hidden">
      <button @click="toggleMenu">
        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24">
          <path :d="mdiMenu" fill="currentColor" />
        </svg>
      </button>
      <div v-if="isOpen" class="flex flex-row">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/stuff">Stuffs</RouterLink>
        <RouterLink to="/encyclopedia">Encyclopedia</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { mdiMenu } from '@mdi/js'
import { ref } from 'vue'
import { useCommonStore } from '@/stores/common'

const commonStore = useCommonStore();

const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>
