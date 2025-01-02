<script setup lang="ts">
import type { ReportInfo } from './const';
import { Link } from '@element-plus/icons-vue'
defineProps<{
  reportInfoList: ReportInfo[]
  height?: string
  width?: string
  classname?: string
}>()

</script>

<template>
  <div class="danger-card" :class="classname">
    <el-table :data="reportInfoList" height="250" :header-cell-style="{ fontWight: 'bold', color: '#333' }">
      <el-table-column prop="reportId" label="AVD编号" />
      <el-table-column prop="reportName" width="500" label="漏洞名称">
        <template #default="scope">
          <el-text line-clamp="2">{{ scope.row.reportName }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="dangerType" label="漏洞类型">
        <template #default="scope">
          <el-tag type="info" effect="plain" v-for="type in scope.row.dangerType" :key="type">{{ type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="披露时间" sortable />
      <el-table-column label="漏洞状态">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isCve">CVE</el-tag>
          <el-tag type="warning" v-if="scope.row.isPoc">Poc</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ref" label="数据来源">
        <template #default="scope">

          <div class="ref-item">
            <el-icon color='#336fff' size="large">
              <Link />
            </el-icon>
            <a :href="scope.row.ref" target="_blank">跳转查看</a>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<style scoped>
.danger-card {
  flex: 1;
  border-radius: 5px;
  background-color: #fff;
  margin: 15px;
  padding: 10px;
}

.card-header {
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;

  .card-title {
    font-size: 18px;
    /* margin-bottom: 10px; */
  }

  .right {
    display: flex;
    align-items: center;
  }
}

.ref-item {
  height: 20px;
  display: inline-flex;
  align-items: center;

  a {
    color: #336fff;
    font-size: 12px;
  }
}
</style>
