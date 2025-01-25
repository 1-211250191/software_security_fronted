<script setup lang="ts">
import type { ReportInfo } from './const';
import HighlightSearch from "@/components/text/HighlightSearch.vue";
import {getSourceIcon, getSourceName} from "../../utils/parseSource.ts";
import { ref, computed } from 'vue';

const props = defineProps<{
  reportInfoList: ReportInfo[]
  height?: string
  width?: string
  classname?: string
  searchQuery?: string
}>()

const currentPage = ref(1)
const pageSize = ref(8)

const totalItems = computed(() => props.reportInfoList.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.reportInfoList.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayPages = 5

  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxDisplayPages - 1)
  if (end - start + 1 < maxDisplayPages) {
    start = Math.max(1, end - maxDisplayPages + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})


</script>

<template>
  <div class="danger-card" :class="classname">
    <table class="danger-card-table">
      <thead>
        <tr>
          <th class="id">漏洞 ID</th>
          <th class="name">漏洞名称</th>
          <th class="time">披露时间</th>
          <th class="level">风险等级</th>
          <th class="ref">报告来源</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedList" :key="item.reportId">
          <td class="id">
            <HighlightSearch
              :text="item.reportId"
              :highlight="searchQuery"
            />
          </td>
          <td class="name">
            <HighlightSearch
              :text="item.reportName"
              :highlight="searchQuery"
            />
          </td>
          <td class="time">{{ item.time }}</td>
          <td class="level">
            <el-tag type="success" v-if="item.isCve">CVE</el-tag>
            <el-tag type="warning" v-if="item.isPoc">PoC</el-tag>
          </td>
          <td class="ref">
            <a :href="item.ref" target="_blank" class="ref-item-container">
              <div class="ref-item">
                <img :src="'/src/assets/sourceIcon/'+getSourceIcon(item.ref)" alt="source" />
                <span>{{getSourceName(item.ref)}}</span>
              </div>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="card-footer">
    <div class="pagination">
      <span class="page-info">
        {{ currentPage }} / {{ totalPages }} 页，共 {{ totalItems }} 条
      </span>
      <button
        class="controller page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>

      <button
        v-for="page in displayedPages"
        :key="page"
        class="page-btn"
        :class="{ active: currentPage === page }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>

      <button
        class="controller page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
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

.ref-item-container {
  display: flex;
  align-items: center;
}

.ref-item {
  height: 20px;
  display: inline-flex;
  align-items: center;
}

.ref-item img {
  height: 18px;
  width: 18px;
  border-radius: 4px;
  margin-right: 5px;
}

.ref-item span {
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
}

.danger-card-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.danger-card-table .id {
  width: 160px;
}

.danger-card-table tbody .id *{
  font-family: Consolas, monospace;
  font-weight: bold;
}

.danger-card-table .name {
  width: 500px;
}

.danger-card-table .time {
  width: 150px;
  min-width: 140px;
}

.danger-card-table .level {
  width: 120px;
  min-width: 100px;
}

.danger-card-table .level .el-tag {
  margin-right: 5px;
}

.danger-card-table .ref {
  width: 120px;
  min-width: 100px;
}

.danger-card-table th {
  background-color: #f6f8fa;
  color: #333;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #d1d9e0;
  border-radius: 6px;
  line-height: 24px;
  text-align: left;
}

.danger-card-table td {
  padding: 10px;
  height: 20px;
  border-radius: 6px;
  border-bottom: 1px solid #d1d9e0;
  color: rgb(31, 35, 40);
}

.danger-card-table tr:last-child td {
  border-bottom: none;
}

.danger-card-table tbody tr {
  transition: background-color 0.3s;
}

.danger-card-table tbody td {
  padding: 6px 10px;
  height: 18px;
  font-size: 14px;
}

.danger-card-table tbody tr:hover {
  background-color: #f6f8fa;
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

.page-info {
  margin-right: 15px;
  color: #21252a;
  font-size: 13px;
  font-weight: bold;
}
</style>
