<template>
  <div class="min-h-screen w-screen flex flex-col md:flex-row">
    <!-- Stuff + Stats -->
    <div class="flex flex-col justify-center items-center md:w-2/5 w-full flex-grow bg-amber-700 p-5">
      <div class="text-center w-full h-auto flex flex-col justify-center">
        <span class="block text-lg font-bold mb-4">Perso niv 200</span>
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 w-full flex-grow">
          <!-- Colonne gauche -->
          <div class="flex flex-col items-center justify-between h-auto">
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
          </div>
          <!-- Colonne centrale (Stats) -->
          <div class="flex h-auto">
            <Stats class="bg-rose-400 w-20 h-auto flex text-white font-bold items-start" />
          </div>

          <!-- Colonne droite -->
          <div class="flex flex-col items-center justify-between h-auto">
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
            <EquipmentSlot />
          </div>
        </div>
        <!-- Slots du bas -->
        <div class="grid grid-cols-6 gap-2 mt-4 w-full h-28 justify-between">
          <EquipmentSlot />
          <EquipmentSlot />
          <EquipmentSlot />
          <EquipmentSlot />
          <EquipmentSlot />
          <EquipmentSlot />
        </div>
      </div>
    </div>
    <!-- Aptitudes + enchantments -->
    <div class="md:w-3/5 w-full flex items-center justify-center bg-amber-950">
      <p class="text-white">À voir</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import EquipmentSlot from '../components/EquipmentSlot.vue';
import Stats from '../components/Stats.vue';
</script>
