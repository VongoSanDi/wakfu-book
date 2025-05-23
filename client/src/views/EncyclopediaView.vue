<template>
  <div class="flex flex-col h-screen w-[80vw] mx-auto bg-amber-500">
    <div class="flex bg-red-500 h-full">

      <!-- Filter -->
      <div class="w-1/6 h-full bg-blue-200 p-2">
        <div class="relative">
          <input v-model="titleQuery" type="text" placeholder="Rechercher un équipement..."
            class="w-full p-2 border rounded pr-10" />
          <!-- <button v-if="titleQuery" @click="clearTitle" -->
          <!--   class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"> -->
          <!--   &times; -->
          <!-- </button> -->
          <label class="flex items-center space-x-2 cursor-pointer mt-4">
            <input type="checkbox" v-model="advancedFilter" class="peer hidden" />
            <span class="w-5 h-5 border-2 border-white peer-checked:bg-yellow-400 flex items-center justify-center">
            </span>
            <span>Recherche avancée</span>
          </label>
          <div v-if="advancedFilter" class="mt-4 space-y-2">
            <input v-model="levelMinQuery" type="number" placeholder="Niv mini" class="w-1/2 p-2 border rounded" />
            <input v-model="levelMaxQuery" type="number" min="1" placeholder="Niv max"
              class="w-1/2 p-2 border rounded" />
            <select v-model="itemTypeQuery" @change="fetchItemsType" name="itemsType"
              class="w-full p-2 border rounded justify-center">
              <option disabled value="">--Sélectionner un type--</option>
              <option v-for="type in itemTypes" :value="type.definition.id" :key="type.definition.id">
                {{ type.title }}
              </option>
            </select>
          </div>
          <button @click="search" class="border-2 border-white mt-3 text-xl w-full">
            Search
          </button>
        </div>

      </div>

      <!-- Data -->
      <div class="w-5/6 bg-blue-800 flex flex-col flex-1 items-center pb-4">
        <div v-if="loading" class="text-white">Loading...</div>


        <div v-if="itemsData.length > 0" class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] w-full px-4">
          <div v-for="item in itemsData" :key="item.id" class="flex flex-col items-center p-2 w-full h-40">
            <img :src="item.imageUrl" class="h-16 object-contain mb-2" />
            <span class="text-center text-sm leading-tight line-clamp-2">
              {{ item.title }}
            </span>
          </div>
        </div>

        <!-- Pagination -->
        <div class="w-[30vw] h-20 mt-auto bg-rose-300 flex justify-around">
          <button @click="previousPage">
            <svg class="w-8 h-8" viewBox="0 0 24 24">
              <path :d="mdiChevronDoubleLeft" fill="currentColor" />
            </svg>
          </button>
          <button @click="nextPage">
            <svg class="w-8 h-8" viewBox="0 0 24 24">
              <path :d="mdiChevronDoubleRight" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { itemService } from '@/services/items/itemService';
import { useCommonStore } from '@/stores/common';
import { mdiChevronDoubleLeft, mdiChevronDoubleRight } from "@mdi/js"
import type { PaginatedItem } from '@/types/item.type';
import { onMounted, ref, watch } from 'vue';
import type { ItemTypes } from '@/types/itemTypes.type';
import type { PaginationParams } from '@/types/api.type';

const advancedFilter = ref(false)
const titleQuery = ref("")
const levelMinQuery = ref(1)
const levelMaxQuery = ref(245)
const itemTypeQuery = ref("")
const loading = ref(false)
const commonStore = useCommonStore()
const itemsData = ref<PaginatedItem["data"]>([])
const itemsMeta = ref<PaginatedItem["meta"]>({} as PaginatedItem["meta"])
const itemTypes = ref<ItemTypes[]>([])
let timeoutId: number | null = null
const pagination = ref<PaginationParams>({
  take: 10,
  page: 1,
  order: 'ASC',
  orderBy: "definition.item.id"
})

/**
 *  Fetch the items
 *
 */
const fetchItems = async () => {
  loading.value = true
  try {
    const { data, meta } = await itemService.find(commonStore.locale, {
      take: pagination.value.take,
      page: pagination.value.page,
      title: titleQuery.value.trim() || undefined,
      levelMin: levelMinQuery.value,
      levelMax: levelMaxQuery.value,
      itemTypeId: itemTypeQuery.value ? parseInt(itemTypeQuery.value) : undefined
    })
    itemsData.value = data
    itemsMeta.value = meta
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet", error)
  } finally {
    loading.value = false
  }
}

const fetchItemsType = async () => {
  itemTypes.value = []
}

const addToForge = () => {
  return null
}

const search = () => {
  fetchItems()
}

// Appel initial de l'API lorsqu'on arrive sur la page
onMounted(() => {
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

const previousPage = () => {
  if (itemsMeta.value.hasPreviousPage) pagination.value.page!--
  fetchItems()
}

const nextPage = () => {
  if (itemsMeta.value.hasNextPage) pagination.value.page!++
  fetchItems()
}

</script>
