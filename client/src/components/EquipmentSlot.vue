<template>
  <div @click="openModal"
    class="bg-orange-950 h-16 w-16 aspect-square flex items-center justify-center border cursor-pointer">
    EquipementSlot
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ itemTypeId: number }>()
const emit = defineEmits(['selectItem'])

const openModal = () => {
  emit('selectItem', props.itemTypeId)
}
</script>
