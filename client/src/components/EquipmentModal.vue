<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
    <div
      class="bg-blue-300 p-5 rounded-lg shadow-lg w-[90vw] h-[80vh] overflow-y-auto modal-content relative flex flex-col transition-all duration-300">
      <div class="flex justify-end">
        <button @click="closeModal"
          class="text-white text-lg font-bold bg-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600">
          &times;
        </button>
      </div>

      <h2 class="text-lg font-bold mb-3 text-center">Détails de l'équipement</h2>

      <!-- Contenu principal en deux colonnes -->
      <div class="flex flex-1 gap-4 mt-4">
        <!-- Barre de recherche (gauche) -->
        <div class="w-1/6 gap-y-4">
          <div class="relative ">
            <input v-model="titleQuery" type="text" placeholder="Rechercher un équipement..."
              class="w-full p-2 border rounded pr-10" />
            <!-- Bouton pour effacer le texte -->
            <button v-if="titleQuery" @click="clearTitle"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <div>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="advancedFilter" class="peer hidden" />
              <span class="w-5 h-5 border-2 border-white peer-checked:bg-yellow-400 flex items-center justify-center">
              </span>
              <span>Recherche avancée</span>
            </label>
          </div>
          <div v-if="advancedFilter">
            <input v-model="levelMinQuery" type="number" placeholder="Niv mini" class="w-1/2 p-2
              border border-round">
            <input v-model="levelMaxQuery" type="number" placeholder="Niv max" class="w-1/2 p-2
              border border-round">
          </div>
        </div>

        <!-- Liste des équipements (droite) -->
        <div class="flex-1 overflow-y-auto border rounded p-2 bg-blue">
          <div v-if="loading">
            Chargement
          </div>
          <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="item in items" :key="item.id" class="p-2 border-b flex" @click="selectItem(item)">
              <img :src="item.imageUrl" :alt="item.title" width={64} height={64} loading="lazy" />
              <div>
                <p><strong>Nom :</strong> {{ item.title }}</p>
                <p><strong>Niveau :</strong> {{ item.level }}</p>
              </div>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <p class="text-gray-500 text-lg">Aucun équipement trouvé.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect, watch } from 'vue'
import type { Item } from '@/types/item.type'
import { itemService } from '@/services/items/itemService'
import { useCommonStore } from '@/stores/common'

const props = defineProps<{ isOpen: boolean; itemTypeId: number | null }>()
const emit = defineEmits(['close', 'select'])

const commonStore = useCommonStore()

const items = ref<Item[]>([])
const loading = ref(false)
const titleQuery = ref("")
const levelMinQuery = ref(1)
const levelMaxQuery = ref(245)
const advancedFilter = ref(false)
let timeoutId: number | null = null

// Fonction pour récupérer les équipements depuis l'API
const fetchItems = async () => {
  if (!props.isOpen) return

  loading.value = true
  try {
    const results = await itemService.find(commonStore.locale, {
      itemTypeId: props.itemTypeId ?? undefined,
      page: 1,
      take: 40,
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

/**
 *
 *
 * @param {Item} item Item to emit
 *
 */
const selectItem = (item: Item) => {
  console.log('item', item)
  emit('select', item)
  emit('close')
}

// Appel initial de l'API lorsque le modal s'ouvre
watchEffect(() => {
  if (props.isOpen) {
    fetchItems()
  }
})

// Déclencher la recherche avec un délai (debounce)
watch(titleQuery, () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    fetchItems()
  }, 300)
})

// Fermeture du modal
const closeModal = () => {
  emit('close')
}

// Efface la recherche et recharge les données par défaut
const clearTitle = () => {
  titleQuery.value = ""
  fetchItems()
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: fadeIn 0.2s ease-out;
}
</style>
