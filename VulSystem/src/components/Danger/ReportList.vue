<script setup lang="ts">
import type { ReportInfo } from './const';
import {computed} from 'vue';
import ReportListTable from "@/components/Danger/ReportListTable.vue";

const props = defineProps<{
  reportInfoList: ReportInfo[]
  filteredReports: ReportInfo[]
  currentPage: number
  totalPages: number
  totalItems: number
  searchQuery?: string
  isFiltered: boolean
}>()


const displayedPages = computed(() => {
  const pages = []
  const maxDisplayPages = 5

  let start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, start + maxDisplayPages - 1)
  if (end - start + 1 < maxDisplayPages) {
    start = Math.max(1, end - maxDisplayPages + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// reset current page when list changes

</script>

<template>
  <div class="danger-card">
    <ReportListTable v-if="!props.isFiltered" :paginated-list="props.reportInfoList" :search-query="searchQuery" />
    <ReportListTable v-else :paginated-list="filteredReports" :search-query="searchQuery" />
  </div>
  <div class="card-footer" v-if="!props.isFiltered">
    <div class="pagination">
      <span class="page-info">
        <span>{{ props.currentPage }} / {{ props.totalPages }} 页</span><span>，共 {{ props.totalItems }} 条</span>
      </span>

      <button
        class="controller page-btn"
        :disabled="props.currentPage === 1"
        @click="$emit('update:currentPage', 1)"
        v-if="props.currentPage > 3"
      >
        首页
      </button>

      <button
        class="controller page-btn"
        :disabled="props.currentPage === 1"
        @click="$emit('update:currentPage', props.currentPage - 1)"
      >
        上一页
      </button>

      <button
        v-for="page in displayedPages"
        :key="page"
        class="page-btn"
        :class="{ active: props.currentPage === page }"
        @click="$emit('update:currentPage', page)"
      >
        {{ page }}
      </button>

      <button
        class="controller page-btn"
        :disabled="props.currentPage === props.totalPages"
        @click="$emit('update:currentPage', props.currentPage + 1)"
      >
        下一页
      </button>

      <button
        class="controller page-btn"
        :disabled="props.currentPage === props.totalPages"
        @click="$emit('update:currentPage', props.totalPages)"
        v-if="props.currentPage < props.totalPages - 2"
      >
        尾页
      </button>
    </div>
  </div>
</template>

<style scoped>
.danger-card {
  flex: 1;
  border-radius: 6px;
  background-color: #fff;
  margin: 15px;
  border: 1px solid #d1d9e0;
}

.card-header {
  width: 100%;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px 10px;

  .card-title {
    font-size: 18px;
    /* margin-bottom: 10px; */
  }

  .right {
    display: flex;
    align-items: center;
  }
}


.pagination {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
  margin: 20px 25px;
}

.page-btn {
  padding: 6px 10px;
  border: 1px solid transparent;
  background-color: rgba(255, 255, 255, 0);
  color: #21252a;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.4s;
}

.controller{
  color: #096be0;
}

.page-btn:hover:not(:disabled) {
  border: 1px solid #dcdfe6;
}

.page-btn.active {
  color: #ffffff;
  border-color: #096be0;
  background-color: #096be0;
}

.page-btn:disabled {
  cursor: not-allowed;
  color: #c0c4cc;
  background-color: #f5f7fa;
}

.page-info span {
  :last-child{
    margin-left: 15px;
  }
  color: #21252a;
  font-size: 13px;
  font-weight: bold;
}
</style>
