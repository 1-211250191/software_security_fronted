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

    <ReportList :reportInfoList="filteredReports" :search-query="searchQuery" v-if="filteredReports.length > 0" />
    <div v-else>
      <el-empty description="暂无数据" :image-size="120"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReportInfo } from '@/components/Danger/const';
import ReportList from '@/components/Danger/ReportList.vue';
import { ArrowRight, DataLine, Search } from '@element-plus/icons-vue'
import { reactive, ref, computed } from 'vue';

const searchQuery = ref('')
const selectedRiskLevel = ref('')
const riskLevelOptions = ['CVE', 'Poc']
const selectedTime = ref('')

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
    isPoc: true,
    ref: 'https://avd.aliyun.com',
  },
  {
      reportName: 'Apache ShardingSphere-UI 任意文件上传漏洞（CVE-2024-42327）',
      reportId: 'AVD-2024-42327',
      dangerType: ['CVE-306'],
      time: '2024-10-01',
      isCve: true,
      isPoc: true,
      ref: 'https://avd.aliyun.com',
  },
  {
    reportName: 'Spring Cloud Gateway RCE 漏洞（CVE-2024-43442）',
    reportId: 'AVD-2024-43442',
    dangerType: ['CVE-202'],
    time: '2024-12-25',
    isCve: true,
    isPoc: true,
    ref: 'https://avd.aliyun.com',
    cvss: '9.8', // 新增 CVSS 评分
    solution: '升级到最新版本，并参考官方补丁说明进行修复。' // 新增解决方案
  },
  {
    reportName: 'Apache Druid SQL注入漏洞',
    reportId: 'AVD-2024-43443',
    dangerType: ['SQL注入'], // 自定义危险类型
    time: '2024-12-26',
    isCve: false, // 非 CVE 漏洞
    isPoc: true,
    ref: 'https://github.com/apache/druid/security',
    attackVector: '网络', // 新增攻击向量
  },
  {
    reportName: '某第三方组件XSS漏洞',
    reportId: 'AVD-2024-43444',
    dangerType: ['XSS'],
    time: '2024-12-27',
    isCve: false,
    isPoc: false,
    ref: 'https://nvd.nist.gov/vuln/detail/CVE-2024-43444',
    affectedVersions: '1.0.0 - 2.3.5', // 新增受影响版本
  },
    {
      "reportName": "Redis 未授权访问漏洞",
      "reportId": "AVD-2024-43445",
      "dangerType": ["未授权访问"],
      "time": "2024-12-28",
      "isCve": false,
      "isPoc": true,
      "ref": "https://github.com/redis/redis/security",
      "attackVector": "本地"
    },
    {
      "reportName": "PostgreSQL 数据库提升权限漏洞（CVE-2024-43446）",
      "reportId": "AVD-2024-43446",
      "dangerType": ["CVE-401"],
      "time": "2024-12-29",
      "isCve": true,
      "isPoc": true,
      "ref": "https://nvd.nist.gov/vuln/detail/CVE-2024-43446",
      "cvss": "8.2",
      "solution": "及时升级到官方推荐版本。"
    },
    {
      "reportName": "NGINX 配置不当导致敏感信息泄露",
      "reportId": "AVD-2024-43447",
      "dangerType": ["配置不当"],
      "time": "2024-12-30",
      "isCve": false,
      "isPoc": false,
      "ref": "https://github.com/nginx/nginx/security",
      "affectedVersions": "1.21.0 - 1.22.3"
    },
    {
      "reportName": "Apache Log4j2 JNDI 注入漏洞（CVE-2024-43448）",
      "reportId": "AVD-2024-43448",
      "dangerType": ["CVE-405"],
      "time": "2025-01-01",
      "isCve": true,
      "isPoc": true,
      "ref": "https://avd.aliyun.com",
      "cvss": "9.0",
      "solution": "更新到安全版本 2.17.0 或更高版本。"
    },
    {
      "reportName": "MySQL 用户权限绕过漏洞",
      "reportId": "AVD-2024-43449",
      "dangerType": ["权限绕过"],
      "time": "2025-01-02",
      "isCve": false,
      "isPoc": true,
      "ref": "https://github.com/mysql/mysql-server/security",
      "attackVector": "网络"
    },
    {
      "reportName": "Elasticsearch REST API XXE 漏洞（CVE-2024-43450）",
      "reportId": "AVD-2024-43450",
      "dangerType": ["CVE-403"],
      "time": "2025-01-03",
      "isCve": true,
      "isPoc": true,
      "ref": "https://nvd.nist.gov/vuln/detail/CVE-2024-43450",
      "cvss": "7.5",
      "solution": "禁用不必要的外部实体解析功能。"
    },
    {
      "reportName": "Jenkins 插件反序列化漏洞",
      "reportId": "AVD-2024-43451",
      "dangerType": ["反序列化"],
      "time": "2025-01-04",
      "isCve": false,
      "isPoc": false,
      "ref": "https://github.com/jenkinsci/security-advisories"
    },
    {
      "reportName": "Docker 容器逃逸漏洞（CVE-2024-43452）",
      "reportId": "AVD-2024-43452",
      "dangerType": ["CVE-402"],
      "time": "2025-01-05",
      "isCve": true,
      "isPoc": true,
      "ref": "https://avd.aliyun.com",
      "cvss": "9.3",
      "solution": "应用最新安全补丁并限制容器特权操作。"
    },
    {
      "reportName": "Kubernetes API Server DoS 漏洞",
      "reportId": "AVD-2024-43453",
      "dangerType": ["拒绝服务"],
      "time": "2025-01-06",
      "isCve": false,
      "isPoc": true,
      "ref": "https://github.com/kubernetes/kubernetes/security",
      "attackVector": "本地"
    },
    {
      "reportName": "Grafana 未授权文件读取漏洞",
      "reportId": "AVD-2024-43454",
      "dangerType": ["未授权访问"],
      "time": "2025-01-07",
      "isCve": false,
      "isPoc": false,
      "ref": "https://github.com/grafana/grafana/security",
      "affectedVersions": "8.0.0 - 8.3.2"
    }
])

const filteredReports = computed(() => {
  console.log(selectedTime.value)
  return reports.filter(report => {
    if(searchQuery.value!='' && !((report.reportName.toLowerCase().includes(searchQuery.value.toLowerCase())||report.reportId.toLowerCase().includes(searchQuery.value.toLowerCase())))){
      return false;
    }
    if(selectedRiskLevel.value=='CVE' && !report.isCve){
      return false;
    }
    if(selectedRiskLevel.value=='Poc' && !report.isPoc){
      return false;
    }
    if(selectedRiskLevel.value.length == 2 && !(report.isCve && report.isPoc)){
      return false;
    }
    if(selectedTime.value!=''){
      const [start, end] = selectedTime.value;
      const reportTime = new Date(report.time).getTime();
      if(reportTime < new Date(start).getTime() || reportTime > new Date(end).getTime()){
        return false;
      }
    }
    return true;
  })
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
