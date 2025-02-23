<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon color="#336FFF" size="14">
        <DocumentCopy />
      </el-icon>
      <span class="bread-item">项目管理</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item>项目信息</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="data-infos">
    <!-- <v-chart ref="mychart1" class="chart"></v-chart> -->
    <DataCard title="项目风险等级分布" width="auto">
      <template #main>
        <WChart width="100%" height="160px" :option="option"></WChart>
      </template>
    </DataCard>
    <DataCard title="项目统计">
      <template #main>
        <div class="static">
          <el-statistic :value="60" :value-style="{ fontSize: '36px', color: '#336fff' }">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-icon style="margin-right: 4px" :size="14">
                  <Tickets />
                </el-icon>
                已上传
              </div>
            </template>
          </el-statistic>
          <el-statistic :value="30" :value-style="{ fontSize: '36px', color: '#336fff' }">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-icon style="margin-right: 4px" :size="14">
                  <Reading />
                </el-icon>
                发现漏洞数
              </div>
            </template>
          </el-statistic>
        </div>
      </template>
    </DataCard>
  </div>

  <DataCard title="项目仓库" width="auto">
    <template #right>
      <el-input style="width: 240px;margin-right: 20px;" placeholder="请输入仓库名">
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" color="#336fff"
        @click="addFormVisible = true;">新建项目</el-button>
    </template>
    <template #main>
      <PInfo v-for="info in projectInfos" :key="info.index" :project="info" @delete="handleDeleteProject"
        @edit="handleEditProject" />
    </template>
  </DataCard>

  <ProjectForm
    type="add"
    :visible="addFormVisible"
    @cancel="() => addFormVisible = false"
    @confirm="handleAddProject"
    @close="() => addFormVisible = false"
  />


</template>

<script setup lang="ts">
import { ArrowRight, Tickets, Reading, Search, DocumentCopy } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import WChart from '@/components/chart/index.vue'
import PInfo from '@/components/Project/PInfo.vue';
import { ProjectStatus, type ProjectInfo } from '@/components/Project/const';
import { reactive, ref } from 'vue';
import ProjectForm from '@/components/Project/ProjectForm.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {createProject, type ProjectCreateResponse} from "@/components/Project/apis.ts";

const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' // Use shadow pointer
    }
  },
  legend: {
    orient: 'horizontal', // 水平放置
    bottom: '5%', // 放在图表底部
    left: '5%', // 放在中间
    itemGap: 30, // 图例项之间的间距
  },
  grid: {
    left: '3%',
    right: '3%',
    top: '10%', // 可以适当调整顶端留白
    bottom: '20%', // 留出底部空间给图例
    containLabel: false,
    gap: '5%',
  },
  xAxis: {
    type: 'value',
    show: false, // Hide the x-axis
    position: 'bottom'
  },
  yAxis: {
    type: 'category',
    data: ['项目等级风险'],
    show: false // Hide the y-axis
  },
  series: [
    {
      name: '高风险',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [20],
      itemStyle: {
        borderRadius: 5,
        // color: '#EE6666' // 设置颜色
        color: '#9045ff'
      },
      barMaxWidth: 45 // 设置柱子的最大宽度，可以控制柱子的整体高度
    },
    {
      name: '低风险',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [10],
      itemStyle: {
        borderRadius: 5, // Add rounded corners
        // color: '#fac858'
        color: '#e3ebff',
      }
    },
    {
      name: '暂无风险',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [30],
      itemStyle: {
        borderRadius: 5, // Add rounded corners
        // color: '#91cc75'
        color: '#336fff',
      },
      barCategoryGap: '30%', // 设置柱状图之间的间隔
    },

  ]
};

const addFormVisible = ref(false)
const handleAddProject = (newProject: ProjectInfo) => {
  console.log(newProject);

  const formData = new FormData();
  formData.append('name', newProject.name);
  formData.append('description', newProject.description);
  formData.append('risk_threshold', newProject.risk_level);
  formData.append('language', newProject.language);
  formData.append('companyName', newProject.company)
  formData.append('file', newProject.file);

  createProject(formData).then((res: ProjectCreateResponse) => {
    console.log(res);
    if(res.code === 200){
      ElMessage({
        message: '成功添加',
        type: 'success',
      })
    }else{
      ElMessage({
        message: '添加失败: ' + res.message + ' ' + res.obj,
        type: 'error',
      })
    }
  });

  addFormVisible.value = false;
}

const handleEditProject = (project: ProjectInfo) => {
  const pos = projectInfos.findIndex(item => item.index === project.index);
  if (pos != -1 && pos < projectInfos.length) {
    projectInfos[pos] = project;
  }
}

const handleDeleteProject = (index: number) => {
  ElMessageBox.confirm('您确定要删除该项目吗?', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(() => {
      const pos = projectInfos.findIndex(item => item.index === index);
      if (pos != -1 && pos < projectInfos.length) {
        projectInfos.splice(pos, 1);
        ElMessage({
          message: '成功删除',
          type: 'success',
        })
      }
    })
    .catch(() => {
      // catch error
    })
}

const projectInfos = reactive<ProjectInfo[]>([
  {
    index: 0,
    title: '仓库名1',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.HIGH,
    widgt: 10,
  },
  {
    index: 1,
    title: '仓库名2',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.LOW,
    widgt: 8,
  },
  {
    index: 2,
    title: '仓库名3',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.ING,
    widgt: 10,
  },
  {
    index: 3,
    title: '仓库名4',
    desc: '仓库描述xxxxxxxxxxxxxxxxxx',
    pStatus: ProjectStatus.SAFE,
    widgt: 10,
  },
]);
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

.chart {
  min-height: 200px;
}

.static {
  height: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
