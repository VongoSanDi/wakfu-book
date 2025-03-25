<template>
  <div class="flex flex-col h-screen w-screen">
    <!-- Barre de recherche -->
    <div class="p-4">
      <div class="relative">
        <input v-model="titleQuery" type="text" placeholder="Rechercher un équipement..."
          class="w-full p-2 border rounded pr-10" />
        <button v-if="titleQuery" @click="clearTitle"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" v-model="advancedFilter" class="peer hidden" />
          <span class="w-5 h-5 border-2 border-white peer-checked:bg-yellow-400 flex items-center justify-center">
          </span>
          <span>Recherche avancée</span>
        </label>
        <div v-if="advancedFilter">
          <input v-model="levelMinQuery" type="number" placeholder="Niv mini" class="w-1/2 p-2
              border border-round">
          <input v-model="levelMaxQuery" type="number" placeholder="Niv max" class="w-1/2 p-2
              border border-round">
        </div>

      </div>
    </div>

    <!-- Contenu scrollable -->
    <div class="flex-1 overflow-y-auto px-4 py-2">
      <div v-if="loading" class="text-white">Loading...</div>

      <div v-else-if="items.length > 0"
        class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(8rem,1fr))] justify-center">
        <div v-for="item in items" :key="item.id" class="flex flex-col items-center p-2 w-full h-40">
          <img :src="item.imageUrl" class="h-16 object-contain mb-2" />
          <span class="text-center text-sm leading-tight line-clamp-2">
            {{ item.title }}
          </span>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500 text-lg">Aucun équipement trouvé.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { itemService } from '@/services/items/itemService';
import { useCommonStore } from '@/stores/common';
import { mdiHammer } from "@mdi/js"
import type { Item } from '@/types/item.type';
import { ref, watch, watchEffect } from 'vue';

const advancedFilter = ref(false)
const titleQuery = ref("")
const levelMinQuery = ref(1)
const levelMaxQuery = ref(245)
const loading = ref(false)
const commonStore = useCommonStore()
const items = ref<Item[]>([])
let timeoutId: number | null = null

const fetchItems = async () => {
  loading.value = true
  try {
    const results = await itemService.find(commonStore.locale, {
      page: 1,
      take: 100,
      title: titleQuery.value.trim() || undefined,
      levelMin: levelMinQuery.value,
      levelMax: levelMaxQuery.value,
    })
    items.value = results
  } catch (error) {
    console.error("Erreur lors de la récupération de l'item", error)
  } finally {
    loading.value = false
  }
}

const addToForge = () => {
  return null
}

// Appel initial de l'API lorsqu'on arrive sur la page
watchEffect(() => {
  fetchItems()
})

// Déclencher la recherche avec un délai (debounce)
watch(titleQuery, () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    fetchItems()
  }, 300)
})

// Efface la recherche et recharge les données par défaut
const clearTitle = () => {
  titleQuery.value = ""
  fetchItems()
}

</script>
