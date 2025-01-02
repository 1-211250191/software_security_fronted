<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon color="#336FFF" size="14">
        <DocumentCopy />
      </el-icon>
      <span class="bread-item">项目管理</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/projects/info' }">项目信息</el-breadcrumb-item>
    <el-breadcrumb-item v-if="project">{{ project }}</el-breadcrumb-item>
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
        <el-descriptions title="" :column="2" border style="margin-top: 15px;">
          <el-descriptions-item label="仓库名" :span="2">{{ projectInfo.title }}</el-descriptions-item>
          <el-descriptions-item label="仓库描述" :span="2">{{ projectInfo.desc }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ projectInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最新扫描时间">{{ projectInfo.detectTime }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Remarks">
            <el-tag size="small">School</el-tag>
          </el-descriptions-item> -->
          <el-descriptions-item label="检测标准阈值">
            {{ projectInfo.widgt ?? 10 }}
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
  <DataCard title="问题列表">
    <template #right>
      <el-button type="primary" plain>查看修复建议</el-button>
    </template>
    <template #main>
      <DangerList :dangerInfoList="dangerList" />
    </template>
  </DataCard>
</template>

<script setup lang="ts">
import { ArrowRight, Search, DocumentCopy } from '@element-plus/icons-vue'
import WChart from '@/components/chart/index.vue'
import DataCard from '@/components/DataCard.vue';
import { ProjectStatus, type ProjectInfoDetail } from '@/components/Project/const';
import { reactive } from 'vue';
import type { DangerInfo } from '@/components/Danger/const';
defineProps<{
  project: string
}>();

const projectInfo = reactive<ProjectInfoDetail>(
  {
    index: 0,
    title: '仓库名1',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.HIGH,
    widgt: 10,
    createTime: '2024-11-25',
    detectTime: '2024-12-30'
  },
);
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
          value: 15,
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
          value: 20,
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
          value: 12,
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
    label: 'com.thoughtworks.xstream: xstream',
    desc: 'Those using Xstream to seralize XML data may be vulnerable to Denial of Service attacks (DOS). If the parser is running on user supplied input, an attacker may supply content that causes the parser to crash by stackoverflow. This effect may support a denial of service attack.',
    ref: '',
    language: 'java',
    risk: 'high',
    detectTime: '2024-11-25'
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
