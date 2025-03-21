import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore('common', () => {
  const locale = ref("fr")
  const setLocale = (newLocale: string) => {
    locale.value = newLocale
  }
  return { locale, setLocale }
})
