<template>
  <div @click="openModal"
    class="bg-orange-950 h-16 w-16 aspect-square flex items-center justify-center border cursor-pointer">
    <img :src="props.item?.imageUrl" />
    <!-- TODO: on hover display stats -->
  </div>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item.type';
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ slotId: string, itemTypeId: number, item?: Item }>()
const emit = defineEmits(['selectItem'])

const openModal = () => {
  emit('selectItem')
}
</script>
