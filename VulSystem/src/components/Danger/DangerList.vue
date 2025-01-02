<script setup lang="ts">
import type { DangerInfo } from './const';
import { Link } from '@element-plus/icons-vue'
defineProps<{
  dangerInfoList: DangerInfo[]
  height?: string
  width?: string
  classname?: string
}>()

const riskTag: { [key: string]: string } = {
  high: 'danger',
  mid: 'warning',
  low: 'primary',
}
</script>

<template>
  <div class="danger-card" :class="classname">
    <el-table :data="dangerInfoList" style="width: 100%">
      <el-table-column prop="label" label="包名" />
      <el-table-column prop="desc" label="描述" show-overflow-tooltip />
      <el-table-column prop="language" label="语言" show-overflow-tooltip />
      <el-table-column prop="detectTime" label="发现时间" />
      <el-table-column prop="risk" label="风险等级">
        <template #default="scope">
          <el-tag :type="riskTag[scope.row.risk]">{{ scope.row.risk }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ref" label="数据来源">
        <template #default="scope">
          <el-icon color='#336fff' size="large">
            <Link />
          </el-icon>
          <span>跳转查看</span>
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
</style>
