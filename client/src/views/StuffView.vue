<template>
  <div class="min-h-screen w-screen flex flex-col md:flex-row">
    <!-- Stuff + Stats -->
    <div class="flex flex-col justify-between items-center md:w-2/5 w-full flex-grow bg-amber-700 p-5">
      <div class="text-center w-full h-auto flex flex-col justify-center">
        <span class="block text-lg font-bold mb-4">Perso niv 200</span>
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 w-full flex-grow">
          <!-- Colonne gauche -->
          <div class="equipment-slot-vertical">
            <EquipmentSlot @selectItem="openModal(134)" /> <!-- Helmet -->
            <EquipmentSlot @selectItem="openModal(120)" /> <!-- Helmet -->
            <EquipmentSlot @selectItem="openModal(136)" /> <!-- Helmet -->
            <EquipmentSlot @selectItem="openModal(103)" /> <!-- Helmet -->
            <EquipmentSlot @selectItem="openModal(647)" /> <!-- Helmet -->
          </div>
          <!-- Colonne centrale (Stats) -->
          <div class="flex h-auto">
            <Stats class="bg-rose-400 w-20 h-auto flex text-white items-start" />
          </div>

          <!-- Colonne droite -->
          <div class="equipment-slot-vertical">
            <EquipmentSlot :item-type-id="138" /> <!-- Cloak -->
            <EquipmentSlot :item-type-id="132" /> <!-- Epaulettes -->
            <EquipmentSlot :item-type-id="133" /> <!-- Belt -->
            <EquipmentSlot :item-type-id="103" /> <!-- Ring -->
            <EquipmentSlot :item-type-id="646" /> <!-- Embleme -->
          </div>
        </div>
        <!-- Slots du bas -->
        <div class="equipment-slot-horizontal">
          <EquipmentSlot :item-type-id="119" /> <!-- Boots -->
          <EquipmentSlot :item-type-id="518 | 519" /> <!-- First weapon -->
          <EquipmentSlot :item-type-id="520" /> <!-- Second weapon -->
          <EquipmentSlot :item-type-id="537" /> <!-- Tool -->
          <EquipmentSlot :item-type-id="611" /> <!-- Mount -->
          <EquipmentSlot :item-type-id="582" /> <!-- Pet -->
        </div>
      </div>
    </div>
    <!-- Aptitudes + enchantments -->
    <div class="md:w-3/5 w-full flex items-center justify-center bg-amber-950">
      <p class="text-white">À voir</p>
    </div>
    <EquipmentModal :isOpen="isModalOpen" :itemTypeId="selectedItemId" @close="isModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EquipmentSlot from '../components/EquipmentSlot.vue';
import EquipmentModal from '../components/EquipmentModal.vue';
import Stats from '../components/Stats.vue';

const isModalOpen = ref(false)
const selectedItemId = ref<number | null>(null)

const openModal = (itemTypeId: number) => {
  selectedItemId.value = itemTypeId
  isModalOpen.value = true
}
</script>
<style scoped>
@reference "../assets/main.css";

.equipment-slot-vertical {
  @apply flex flex-col items-center justify-between h-auto
}

.equipment-slot-horizontal {
  @apply grid grid-cols-6 mt-4 w-full h-28 justify-between
}
</style>
