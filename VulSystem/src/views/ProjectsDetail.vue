<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon color="#336FFF" size="14">
        <DocumentCopy />
      </el-icon>
      <span class="bread-item">项目管理</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/projects/info' }">项目信息</el-breadcrumb-item>
    <el-breadcrumb-item v-if="projectInfo && projectInfo.projectName">{{ projectInfo.projectName }}</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="data-infos">
    <!-- <v-chart ref="mychart1" class="chart"></v-chart> -->
    <DataCard title="漏洞分布" width="auto">
      <template #main>
        <WChart width="100%" height="200px" :option="option"></WChart>
      </template>
    </DataCard>
    <DataCard title="项目基础信息">
      <template #main>
        <el-descriptions title="" :column="2" border style="margin-top: 15px;" v-if="projectInfo">
          <el-descriptions-item label="仓库名" :span="2">{{ projectInfo.projectName }}</el-descriptions-item>
          <el-descriptions-item label="仓库描述" :span="2">{{ projectInfo.projectDescription }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ timeFormatter(projectInfo.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="最新扫描时间">{{ timeFormatter(projectInfo.lastScanTime) }}</el-descriptions-item>
          <el-descriptions-item label="检测标准阈值">
            {{ projectInfo.riskThreshold ?? 0.45 }}
          </el-descriptions-item>
          <el-descriptions-item label="项目语言">
            {{ projectInfo.language ?? 'java' }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </DataCard>
  </div>
  <DataCard title="组件分析" width="auto">
    <template #right>
      <el-input style="width: 240px;margin-right: 20px;" placeholder="请输入组件名称">
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" color="#336fff">导出SBOM</el-button>
    </template>
    <template #main>
      <div class="tree-container">
        <el-tree :data="data" node-key="id" default-expand-all :props="{ class: 'custom-node' }" />
      </div>
    </template>
  </DataCard>
  <DataCard title="问题列表" width="auto">
    <template #main>
      <DangerCard v-for="danger in dangerList" :key="danger.id" :info="danger" />
    </template>
  </DataCard>
</template>

<script setup lang="ts">
import { ArrowRight, Search, DocumentCopy } from '@element-plus/icons-vue'
import WChart from '@/components/chart/index.vue'
import DataCard from '@/components/DataCard.vue';
import { ProjectStatus, type ProjectInfoDetail } from '@/components/Project/const';
import { onMounted, reactive, ref } from 'vue';
import type { DangerInfo } from '@/components/Danger/const';
import { api } from './service';
import DangerCard from '@/components/Danger/DangerCard.vue';
const props = defineProps<{
  projectId: number
}>();
const timeFormatter = (dateString: string) => {
  // 将字符串转换为 Date 对象
  const date = new Date(dateString);

  // 获取年份、月份和日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是0-11，+1后格式化为2位数
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期并格式化为2位数

  // 将结果拼接为 "year-month-date" 格式
  const formattedDate = `${year}-${month}-${day}`;

  console.log(formattedDate); // 输出: "2025-02-13"
  return formattedDate
}
const projectInfo = ref<ProjectInfoDetail>({
  "id": 1,
  "projectName": "project1",
  "createTime": "Fri Feb 14 17:11:38 CST 2025",
  "projectDescription": "1",
  "language": "java",
  "riskThreshold": 10,
  "highRiskNum": 1,
  "lowRiskNum": 0,
  "midRiskNum": 1,
  "lastScanTime": "2025-02-14T06:00"
});

// onMounted(() => {
//   api.getProjectDetail(props.projectId)
//     .then(res => {
//       projectInfo.value = res.data.obj
//     })
// })


const option = {
  xAxis: {
    type: 'category',
    data: ['高', '中', '低'],
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [
        {
          value: projectInfo.value?.highRiskNum ?? 0,
          label: {
            position: 'top',
            show: true
          },
          itemStyle: {
            borderRadius: 5,
            color: '#f63f3f'
          },
        },
        {
          value: projectInfo.value?.midRiskNum ?? 0,
          label: {
            position: 'top',
            show: true
          },
          itemStyle: {
            borderRadius: 5,
            color: '#f5800c'
          }
        },
        {
          value: projectInfo.value?.lowRiskNum ?? 0,
          label: {
            show: true,
            position: 'top',

          },
          itemStyle: {
            borderRadius: 5,
            color: '#fddb13'
          }
        },
      ],
      type: 'bar',
      barWidth: 25
    }
  ]
};
interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const data: Tree[] = [
  {
    id: 0,
    label: 'org.springframework.boot:spring-boot-starter-web',
    children: [
      {
        id: 1,
        label: 'org.springframework.boot:spring-boot-starter',
        children: [
          {
            id: 2,
            label: 'org.springtramework.boot:spring-boot-starter-logging',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'org.springframework.boot:spring-boot-starter-tomcat',
    children: [
      {
        id: 4,
        label: 'org.apache.tomcat.embed:tomcat-embed-el',
        children: [
          {
            id: 5,
            label: 'org.apache.tomcat.embed:tomcat-embed-websocket',
          },
        ],
      },
      {
        id: 6,
        label: 'org.apache.tomcat.embed:tomcat-embed-core',
      },
    ],
  },

]
const dangerList = reactive<DangerInfo[]>([
  {
    id: 1,
    name: "err1",
    description: "err1",
    language: "java",
    time: "Fri Feb 14 00:00:00 CST 2025",
    riskLevel: "高风险",
    isaccept: 0,
    ref: ''
  },
  {
    id: 2,
    name: "err2",
    description: "err2",
    language: "java",
    time: "Thu Feb 13 00:00:00 CST 2025",
    riskLevel: "中风险",
    isaccept: 0,
    ref: ''
  }
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

.data-infos {
  display: flex;
}

.tree-container {
  margin: 15px;
}

.custom-node .el-tree-node__content {
  color: #626aef;
  font-size: 20px !important;
  height: 25px;
}
</style>
