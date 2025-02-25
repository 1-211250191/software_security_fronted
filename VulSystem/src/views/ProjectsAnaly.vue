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
            <el-statistic :value="5" :value-style="{ fontSize: '36px', color: '#336fff' }">
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
import { type ProjectInfo, type ProjectInfoDetail } from '@/components/Project/const';
import { reactive } from 'vue';
defineProps<{
  project: string
}>();

const dangerProjectInfos = reactive<ProjectInfo[]>([
  {
    "risk_level": "低风险",
    "name": "Google Guava",
    "description": "Guava是Google开发的Java库，提供了许多实用的工具类和功能。其仓库位于GitHub，是Java开发中常用的工具库‌",
    "id": "1"
  },
  {
    "risk_level": "高风险",
    "name": "Google TensorFlow‌",
    "description": "TensorFlow是Google开发的开源机器学习框架，用于构建和训练深度学习模型。该项目的仓库位于GitHub，详细信息可以在其官方GitHub页面找到‌",
    "id": "2"
  },
  {
    "risk_level": "高风险",
    "name": "Google Angular‌",
    "description": "Angular是Google开发的前端框架，用于构建单页和移动应用程序。其仓库位于GitHub，提供了丰富的功能和社区支持‌",
    "id": "3"
  }
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
