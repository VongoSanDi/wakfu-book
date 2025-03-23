<template>
  <div class="min-h-screen w-screen flex flex-col md:flex-row">
    <!-- Stuff + Stats -->
    <div class="flex flex-col justify-between items-center md:w-2/5 w-full flex-grow bg-amber-700 p-5">
      <div class="text-center w-full h-auto flex flex-col justify-center">
        <span class="block text-lg font-bold mb-4">Perso niv 200</span>
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 w-full flex-grow">
          <!-- Colonne gauche -->
          <div class="equipment-slot-vertical">
            <EquipmentSlot slot-id="helmet" :item-type-id="134" :item="selectedItems['helmet']"
              @selectItem="openModal('helmet', 134)" />
            <EquipmentSlot slot-id="amulet" :item-type-id="120" :item="selectedItems['amulet']"
              @selectItem="openModal('amulet', 120)" />
            <EquipmentSlot slot-id="breastplease" :item-type-id="136" :item="selectedItems['breastplate']"
              @selectItem="openModal('breastplate', 136)" />
            <EquipmentSlot slot-id="ring1" :item-type-id="103" :item="selectedItems['ring1']"
              @selectItem="openModal('ring1', 103)" />
            <EquipmentSlot slot-id="costume" :item-type-id="647" :item="selectedItems['costume']"
              @selectItem="openModal('costume', 647)" />
          </div>
          <!-- Colonne centrale (Stats) -->
          <div class="flex h-auto">
            <Stats class="bg-rose-400 w-20 h-auto flex text-white items-start" />
          </div>

          <!-- Colonne droite -->
          <div class="equipment-slot-vertical">
            <EquipmentSlot slot-id="cloak" :item-type-id="138" :item="selectedItems['cloack']"
              @selectItem="openModal('cloack', 138)" />
            <EquipmentSlot slot-id="epaulettes" :item-type-id="132" :item="selectedItems['epaulettes']"
              @selectItem="openModal('epaulettes', 132)" />
            <EquipmentSlot slot-id="belt" :item-type-id="133" :item="selectedItems['belt']"
              @selectItem="openModal('belt', 133)" />
            <EquipmentSlot slot-id="ring2" :item-type-id="103" :item="selectedItems['ring2']"
              @selectItem="openModal('ring2', 103)" />
            <EquipmentSlot slot-id="embleme" :item-type-id="646" :item="selectedItems['embleme']"
              @selectItem="openModal('embleme', 646)" />
          </div>
        </div>
        <!-- Slots du bas -->
        <div class="equipment-slot-horizontal">
          <EquipmentSlot slot-id="boots" :item-type-id="119" :item="selectedItems['boots']"
            @selectItem="openModal('boots', 119)" />
          <EquipmentSlot slot-id="first-weapon" :item-type-id="518 | 519" :item="selectedItems['first-weapon']"
            @selectItem="openModal('first-weapon', 518 | 519)" />
          <EquipmentSlot slot-id="second-weapon" :item-type-id="520" :item="selectedItems['second-weapon']"
            @selectItem="openModal('second-weapon', 520)" />
          <EquipmentSlot slot-id="tool" :item-type-id="537" :item="selectedItems['tool']"
            @selectItem="openModal('tool', 537)" />
          <EquipmentSlot slot-id="mount" :item-type-id="611" :item="selectedItems['mount']"
            @selectItem="openModal('mount', 611)" />
          <EquipmentSlot slot-id="pet" :item-type-id="582" :item="selectedItems['pet']"
            @selectItem="openModal('pet', 582)" />
        </div>
      </div>
    </div>
    <!-- Aptitudes + enchantments -->
    <div class="md:w-3/5 w-full flex items-center justify-center bg-amber-950">
      <p class="text-white">À voir</p>
    </div>
    <EquipmentModal :isOpen="isModalOpen" :itemTypeId="selectedItemId" @close="isModalOpen = false"
      @select="handleSelectItem" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EquipmentSlot from '../components/EquipmentSlot.vue';
import EquipmentModal from '../components/EquipmentModal.vue';
import Stats from '../components/Stats.vue';
import type { Item } from '@/types/item.type';

const isModalOpen = ref(false)
const selectedItemId = ref<number | null>(null)
const selectedItems = ref<Record<string, Item>>({})

const selectedSlotId = ref<string | null>(null)
const openModal = (slotId: string, itemTypeId: number) => {
  selectedSlotId.value = slotId
  selectedItemId.value = itemTypeId
  isModalOpen.value = true
}

const handleSelectItem = (item: Item) => {
  if (selectedSlotId.value) {
    selectedItems.value[selectedSlotId.value] = item
  }
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
