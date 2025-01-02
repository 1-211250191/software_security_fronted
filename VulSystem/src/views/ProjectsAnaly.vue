<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon color="#336FFF" size="14">
        <DocumentCopy />
      </el-icon>
      <span class="bread-item">项目管理</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item>项目综合分析</el-breadcrumb-item>
  </el-breadcrumb>

  <DataCard title="漏洞情况统计" width="auto">
    <template #main>
      <WChart width="100%" height="200px" :option="dangerChangeOption"></WChart>
    </template>
  </DataCard>
  <div class="data-infos">
    <!-- <v-chart ref="mychart1" class="chart"></v-chart> -->
    <DataCard title="待解决项目">
      <template #main>
        <PInfo v-for="info in dangerProjectInfos" :key="info.index" :project="info" :canEdit="false" />
      </template>
    </DataCard>
    <div class="right-info">
      <DataCard title="组件统计">
        <template #main>
          <div class="static">
            <el-statistic :value="60" :value-style="{ fontSize: '36px', color: '#336fff' }">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  <el-icon style="margin-right: 4px" :size="14">
                    <Tickets />
                  </el-icon>
                  已扫描
                </div>
              </template>
            </el-statistic>
            <el-statistic :value="30" :value-style="{ fontSize: '36px', color: '#336fff' }">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  <el-icon style="margin-right: 4px" :size="14">
                    <Reading />
                  </el-icon>
                  漏洞组件数
                </div>
              </template>
            </el-statistic>
          </div>
        </template>
      </DataCard>

      <DataCard title="各项编程语言占比">
        <template #main>
          <WChart width="100%" height="250px" :option="languageOption"></WChart>
        </template>
      </DataCard>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ArrowRight, Tickets, Reading, DocumentCopy } from '@element-plus/icons-vue'
import WChart from '@/components/chart/index.vue'
import DataCard from '@/components/DataCard.vue';
import PInfo from '@/components/Project/PInfo.vue';
import { ProjectStatus, type ProjectInfo, type ProjectInfoDetail } from '@/components/Project/const';
import { reactive } from 'vue';
defineProps<{
  project: string
}>();

const dangerProjectInfos = reactive<ProjectInfo[]>([
  {
    index: 0,
    title: '仓库名1',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.HIGH,
    widgt: 10,
  },
  // {
  //   index: 19,
  //   title: '仓库名20',
  //   desc: '仓库描述xxxxxxxxxxxxxxxxxx',
  //   pStatus: ProjectStatus.HIGH,
  //   widgt: 10,
  // },
  // {
  //   index: 6,
  //   title: '仓库名7',
  //   desc: '仓库描述xxxxxxxxxxxxxxxxxx',
  //   pStatus: ProjectStatus.HIGH,
  //   widgt: 10,
  // },
  {
    index: 1,
    title: '仓库名2',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.LOW,
    widgt: 8,
  },
  {
    index: 9,
    title: '仓库名10',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.LOW,
    widgt: 10,
  },
]);
const dangerChangeOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['高风险', '中风险', '低风险'],
    right: '5%',
    top: '5%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // toolbox: {
  //   feature: {
  //     saveAsImage: {}
  //   }
  // },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '高风险',
      type: 'line',
      // stack: 'Total',
      smooth: true,
      data: [12, 13, 10, 13, 9, 15, 21],
      itemStyle: {
        color: '#f5800c',
      }
    },
    {
      name: '中风险',
      type: 'line',
      // stack: 'Total',
      smooth: true,
      data: [2, 18, 19, 15, 29, 33, 31],
      itemStyle: {
        color: '#fac858',
      }
    },
    {
      name: '低风险',
      type: 'line',
      // stack: 'Total',
      smooth: true,
      data: [15, 45, 10, 5, 19, 20, 41],
      itemStyle: {
        color: '#91cc75',
      }
    },
  ]
};

const languageOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical', // 垂直排列
    right: '5%', // 左侧显示
    top: 'center'
  },
  series: [
    {
      // name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'], // 保持饼图居中
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false, // 默认不显示标签
        position: 'center'
      },
      // label: {
      //   show: true, // 显示标签
      //   position: 'inside', // 设置标签显示在扇形区外
      //   formatter: '{d}%', // 显示名称、值和占比
      // },
      emphasis: {
        label: {
          show: true, // 鼠标悬停时显示标签
          formatter: '{b}: {d}%', // 显示名称和占比
          fontSize: '20', // 可以根据需求调整字体大小
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Java' },
        { value: 735, name: 'C++' },
        { value: 580, name: 'Go' },
        { value: 300, name: '其它' }
      ]
    }
  ]
};


</script>

<style scoped>
.bread {
  margin: 15px;
  margin-bottom: 30px;

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

  .right-info {
    min-width: 330px;
    width: 30%;
    display: flex;
    flex-direction: column;
  }
}

.static {
  height: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
