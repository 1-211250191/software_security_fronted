<template>
  <div class="report-view-container">
    <el-breadcrumb :separator-icon="ArrowRight" class="bread">
      <el-breadcrumb-item :to="{ path: '/reports' }">
        <el-icon color="#336FFF" size="14">
          <DataLine />
        </el-icon>
        <span class="bread-item">漏洞报告</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="search-line">
      <el-input class="input" v-model="searchQuery" placeholder="请输入搜索内容" :style="{ 'border-radius': '6px' }">
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <div class="search-filter-group">
        <div class="search-item">
          <div class="label">风险等级</div>
          <el-select v-model="selectedRiskLevel" multiple placeholder="请选择" style="width: 240px;">
            <el-option v-for="item in riskLevelOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">时间 </div>
          <el-date-picker
            v-model="selectedTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
            @clear="selectedTime = ''"
          />
        </div>
      </div>
    </div>

    <LoadingFrames v-if="isLoading" class="loading-frames"/>
    <ReportList
      :reportInfoList="reportList"
      :search-query="searchQuery"
      :current-page="currentPage"
      :total-items="totalItems"
      :total-pages="totalPages"
      :filtered-reports="filteredReports"
      @update:currentPage="currentChange"
      v-else
    />
  </div>
</template>

<script setup lang="ts">
import type { ReportInfo } from '@/components/Danger/const';
import ReportList from '@/components/Danger/ReportList.vue';
import { ArrowRight, DataLine, Search } from '@element-plus/icons-vue'
import {ref, onMounted, watch, type Ref} from 'vue';
import {
  getVulnerabilityReportList,
  getVulnerabilityReportSearch,
  type VulnerabilityReportListResponse, type VulnerabilityReportSearchResponse
} from "@/components/Danger/apis.ts";
import LoadingFrames from "@/components/LoadingFrames.vue";

const searchQuery = ref('')
const selectedRiskLevel = ref('')
const riskLevelOptions = ['Low', 'Medium', 'High']
const selectedTime = ref('')

// const reports = reactive<ReportInfo[]>([]);
//
// const filteredReports = computed(() => {
//   console.log(selectedTime.value)
//   return reports.filter(report => {
//     if(searchQuery.value!='' && !((report.reportName.toLowerCase().includes(searchQuery.value.toLowerCase())||report.reportId.toLowerCase().includes(searchQuery.value.toLowerCase())))){
//       return false;
//     }
//     if(selectedRiskLevel.value=='CVE' && !report.isCve){
//       return false;
//     }
//     if(selectedRiskLevel.value=='Poc' && !report.isPoc){
//       return false;
//     }
//     if(selectedRiskLevel.value.length == 2 && !(report.isCve && report.isPoc)){
//       return false;
//     }
//     if(selectedTime.value!=''){
//       const [start, end] = selectedTime.value;
//       const reportTime = new Date(report.time).getTime();
//       if(reportTime < new Date(start).getTime() || reportTime > new Date(end).getTime()){
//         return false;
//       }
//     }
//     return true;
//   })
// })

const reportList = ref<ReportInfo[]>([]);
let currentPage = ref(1);
let totalPages = ref(0);
let totalItems = ref(0);

// loading-frames
const isLoading = ref(true);

// report list
function currentChange(page: number) {
  currentPage.value = page;
  getReports(page);
}

async function getReports(currentPage: number) {
  isLoading.value = true;
  const pageSize = 10;
  reportList.value = [];
  await getVulnerabilityReportList(currentPage, pageSize).then((res) => {
    let data:VulnerabilityReportListResponse = res;
    totalPages.value = data.obj.pages;
    totalItems.value = data.obj.total;
    for(let i=0; i<data.obj.records.length; i++) {
        let report = data.obj.records[i];
        reportList.value.push({
          reportName: report.vulnerabilityName,
          reportId: report.cveId,
          time: report.disclosureTime,
          riskLevel: report.riskLevel,
          ref: report.referenceLink
        });
    }
    console.log(reportList.value);
  });
  isLoading.value = false;
}

// search
const filteredReports = ref([])

function debounce<T extends (...args: any[]) => Promise<void> | void>(
  fn: T,
  delay: number,
  isLoadingRef: Ref<boolean>
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    isLoadingRef.value = true;
    timeoutId = setTimeout(async () => {
      try {
        await fn.apply(this, args); // 等待异步操作完成
      } finally {
        isLoadingRef.value = false; // 无论如何都更新状态
      }
    }, delay);
  } as T;
}

async function searchReports(keyword: string) {
  filteredReports.value = [];
  isLoading.value = true;
  await getVulnerabilityReportSearch(keyword).then((res) => {
    let data:VulnerabilityReportSearchResponse = res;
    for(let i=0; i<data.obj.length; i++) {
        let report = data.obj[i];
      filteredReports.value.push({
          reportName: report.vulnerabilityName,
          reportId: report.cveId,
          time: report.disclosureTime,
          riskLevel: report.riskLevel,
          ref: report.referenceLink
        });
    }
    console.log(filteredReports.value);
  });
  isLoading.value = false;
}
const debouncedSearch = debounce(async (query: string) => {
  if (query) {
    await searchReports(query);
  } else {
    filteredReports.value = [];
  }
}, 500, isLoading); // 500ms debounce time

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

onMounted(() => {
  getReports(currentPage.value);
})

</script>

<style scoped>
.report-view-container{
  container-name: reportsView;
  container-type: inline-size;
}

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
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .input {
    width: 340px;
    margin-right: 20px;
  }

  .search-filter-group {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 20px;
  }

  .search-item {
    display: flex;
    align-items: center;

    .label {
      margin-right: 10px;
      color: #555557;
      font-weight: bold;
      min-width: fit-content;
    }
  }
}

.loading-frames{
  margin-top: 20vh;

}

@container reportsView (max-width: 931px) {
  .search-line {
    flex-direction: column;
    align-items: flex-start;

    .input {
      margin-right: 0;
      margin-bottom: 10px;
      width: 100%;
    }

    .search-item {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .search-filter-group{
    width: 100%;
    min-width: 100%;
    justify-content: space-between;
  }
}
</style>
