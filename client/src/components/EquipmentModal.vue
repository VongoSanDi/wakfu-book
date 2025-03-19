<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
    <div
      class="bg-blue-300 p-5 rounded-lg shadow-lg w-[60vw] h-[80vh] overflow-y-auto modal-content relative flex flex-col transition-all duration-300">
      <!-- Bouton Fermer (croix "X") en haut à droite -->
      <div class="flex justify-end">
        <button @click="closeModal"
          class="text-white text-lg font-bold bg-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600">
          &times;
        </button>
      </div>

      <h2 class="text-lg font-bold mb-3 text-center">Détails de l'équipement</h2>

      <!-- Champ de recherche -->
      <div class="relative w-full mt-2">
        <input v-model="searchQuery" type="text" placeholder="Rechercher un équipement..."
          class="w-full p-2 border rounded pr-10" />
        <!-- Bouton pour effacer le texte -->
        <button v-if="searchQuery" @click="clearSearch"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      <!-- Liste des équipements récupérés depuis l'API -->
      <div class="flex flex-col">
        <div v-if="items.length > 0">
          <div v-for="item in items" :key="item.id" class="p-2 border-b">
            <p><strong>Nom :</strong> {{ item.title }}</p>
            <p><strong>Niveau :</strong> {{ item.level }}</p>
            <p><strong>Description :</strong> {{ item.description }}</p>
          </div>
        </div>
        <div v-else class="flex flex-grow items-center justify-center">
          <p class="text-gray-500 text-lg">Aucun équipement trouvé.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect, watch } from 'vue'
import type { Item } from '@/types/item.type'
import { itemService } from '@/services/itemsService';

const props = defineProps<{ isOpen: boolean, itemTypeId: number }>()
const emit = defineEmits(['close'])

const items = ref<Item[]>([])
const loading = ref(false)
const searchQuery = ref("")
let timeoutId: number | null = null

// Fonction pour récupérer les équipements depuis l'API
const fetchItems = async () => {
  if (!props.isOpen) return;

  loading.value = true;
  try {
    const results = await itemService.find({
      itemTypeId: props.itemTypeId,
      locale: "fr",
      page: 1,
      take: 100,
      title: searchQuery.value.trim() || undefined, // Envoi du paramètre `title` s'il est défini
    })
    items.value = results;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'item", error);
  } finally {
    loading.value = false;
  }
}

// Appel initial de l'API lorsque le modal s'ouvre
watchEffect(() => {
  if (props.isOpen) {
    fetchItems();
  }
});

// Déclencher la recherche avec un délai (debounce)
watch(searchQuery, () => {
  if (timeoutId) clearTimeout(timeoutId); // Annule le précédent appel en attente
  timeoutId = setTimeout(() => {
    fetchItems();
  }, 300); // Attend 300ms avant d'exécuter la recherche
});

// Fermeture du modal
const closeModal = () => {
  emit('close');
}

// Clear the texte in the search field
const clearSearch = () => {
  searchQuery.value = "";
  fetchItems(); // Recharge les données par défaut
};
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
