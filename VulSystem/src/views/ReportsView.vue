<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/reports' }">
      <el-icon color="#336FFF" size="14">
        <DataLine />
      </el-icon>
      <span class="bread-item">漏洞报告</span>
    </el-breadcrumb-item>
  </el-breadcrumb>

  <div class="search-line">
    <el-input style="width: 30%;margin-right: 20px;" placeholder="请输入关键词">
      <template #suffix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
    <div class="search-item">
      <div class="label">使用语言: </div>
      <el-select v-model="language" multiple placeholder="Select" style="width: 240px">
        <el-option v-for="item in languageOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </div>

  <ReportList :reportInfoList="reports" />
</template>

<script setup lang="ts">
import type { ReportInfo } from '@/components/Danger/const';
import ReportList from '@/components/Danger/ReportList.vue';
import { ArrowRight, DataLine, Search } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';


const language = ref<string[]>([]);
const languageOptions = ['java', 'c++', 'go']

const reports = reactive<ReportInfo[]>([
  {
    reportName: 'Apache HugeGraph-Server JWT 权限绕过漏洞（CVE-2024-43441）',
    reportId: 'AVD-2024-43441	',
    dangerType: ['CVE-302'],
    time: '2024-12-24',
    isCve: true,
    isPoc: false,
    ref: 'https://avd.aliyun.com',
  },
  {
    reportName: 'Zabbix user.get API SQL 注入漏洞（CVE-2024-42327）',
    reportId: 'AVD-202442327',
    dangerType: ['CVE-306'],
    time: '2024-10-01',
    isCve: true,
    isPoc: false,
    ref: 'https://avd.aliyun.com',
  },
])
</script>

<style scoped>
.bread {
  margin: 15px;

  .el-breadcrumb__item {
    height: 18px;
  }

  .bread-item {
    color: #336FFF;
    /* font-size: 16px; */
    margin-left: 10px;
    font-weight: bold;
  }
}

.search-line {
  margin-top: 30px;
  padding: 5px 25px;
  display: flex;
  align-items: center;

  .search-item {
    margin-left: 30px;
    display: flex;
    align-items: center;

    .label {
      margin-right: 10px;
      color: #555557;
    }
  }

}
</style>
