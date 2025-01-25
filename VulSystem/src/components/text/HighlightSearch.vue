<!-- HighlightSearch.vue -->
<!--This is a reusable component that highlights the search query in the text.-->
<template>
  <span v-html="highlightedText"></span>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  highlight: {
    type: String,
    required: true
  }
})

const highlightedText = computed(() => {
  if (!props.highlight) return props.text;
  const regex = new RegExp(`(${props.highlight})`, 'gi');
  return props.text.replace(regex, '<span class="highlight bounce-animation">$1</span>');
})

watch(() => props.highlight, () => {
  // remove and add class to trigger animation
  const elements = document.getElementsByClassName('highlight');
  Array.from(elements).forEach(element => {
    element.classList.remove('bounce-animation');
    // trigger reflow
    void element.offsetWidth;
    element.classList.add('bounce-animation');
  });
})
</script>

<style scoped>
@keyframes bounce {
  0% {
    transform: translateY(-1px);
  }
  10%, 30% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

:deep(.highlight) {
  background-color: rgba(255, 245, 102, 0.7);
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 4px;
  display: inline-block;
}

:deep(.bounce-animation) {
  animation: bounce 0.4s ease;
}
</style>
