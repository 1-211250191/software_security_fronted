<script setup lang="ts">

import {getSourceIcon, getSourceName} from "@/utils/parseSource.ts";
import HighlightSearch from "@/components/text/HighlightSearch.vue";
import type {ReportInfo} from "@/components/Danger/const.ts";

const props = defineProps<{
  paginatedList: ReportInfo[],
  searchQuery: string
}>()
</script>

<template>
  <table class="danger-card-table" v-if="paginatedList.length > 0">
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
    <tr v-for="item in props.paginatedList" :key="item.reportId">
      <td class="id">
        <HighlightSearch
          :text="item.reportId"
          :highlight="props.searchQuery"
        />
      </td>
      <td class="name">
        <HighlightSearch
          :text="item.reportName"
          :highlight="props.searchQuery"
        />
      </td>
      <td class="time">{{ item.time }}</td>
      <td class="level">
        <el-tag type="success" v-if="item.riskLevel==='Low'">{{item.riskLevel}}</el-tag>
        <el-tag type="warning" v-else-if="item.riskLevel==='Medium'">{{item.riskLevel}}</el-tag>
        <el-tag type="danger" v-else-if="item.riskLevel==='High'">{{item.riskLevel}}</el-tag>
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
  <div v-else>
    <el-empty description="暂无数据" :image-size="120"/>
  </div>
</template>

<style scoped>
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
  color: #096be0;
}



</style>
