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
          <el-statistic :value="3" :value-style="{ fontSize: '36px', color: '#336fff' }">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-icon style="margin-right: 4px" :size="14">
                  <Tickets />
                </el-icon>
                已上传
              </div>
            </template>
          </el-statistic>
          <el-statistic :value="2" :value-style="{ fontSize: '36px', color: '#336fff' }">
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
      <el-button type="primary" color="#336fff" @click="addFormVisible = true;">新建项目</el-button>
    </template>
    <template #main>
      <div v-if="isLoading" style="display: flex; justify-content: center; align-items: center; height: 200px;">
        <LoadingFrames size="large"></LoadingFrames>
      </div>
      <div v-else>
        <PInfo v-for="info in projectInfos" :key="info.index" :project="info" @delete="handleDeleteProject"
          @edit="handleEditProject" />
      </div>
    </template>
  </DataCard>

  <ProjectForm type="add" :visible="addFormVisible" @cancel="() => addFormVisible = false" @confirm="handleAddProject"
    @close="() => addFormVisible = false" />


</template>

<script setup lang="ts">
import { ArrowRight, Tickets, Reading, Search, DocumentCopy } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import WChart from '@/components/chart/index.vue'
import PInfo from '@/components/Project/PInfo.vue';
import { type ProjectInfo } from '@/components/Project/const';
import { onMounted, reactive, ref } from 'vue';
import ProjectForm from '@/components/Project/ProjectForm.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createProject, deleteProject,
  getProjectList,
  type ProjectCreateResponse,
  type ProjectListResponse, updateProject
} from "@/components/Project/apis.ts";
import LoadingFrames from "@/components/LoadingFrames.vue";

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
      data: [2],
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
      data: [1],
      itemStyle: {
        borderRadius: 5, // Add rounded corners
        // color: '#fac858'
        color: '#e3ebff',
      }
    },
    // {
    //   name: '暂无风险',
    //   type: 'bar',
    //   stack: 'total',
    //   label: {
    //     show: true
    //   },
    //   emphasis: {
    //     focus: 'series'
    //   },
    //   data: [0],
    //   itemStyle: {
    //     borderRadius: 5, // Add rounded corners
    //     // color: '#91cc75'
    //     color: '#336fff',
    //   },
    //   barCategoryGap: '30%', // 设置柱状图之间的间隔
    // },

  ]
};

const addFormVisible = ref(false)
const handleAddProject = (newProject: ProjectInfo) => {
  console.log(newProject);

  const formData = new FormData();
  formData.append('name', newProject.name);
  formData.append('description', newProject.description);
  formData.append('risk_threshold', newProject.risk_threshold);
  formData.append('language', newProject.language);
  formData.append('companyName', newProject.company)
  formData.append('file', newProject.file);

  createProject(formData).then((res: ProjectCreateResponse) => {
    console.log(res);
    if (res.code === 200) {
      ElMessage({
        message: '成功添加',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '添加失败: ' + res.message + ' ' + res.obj,
        type: 'error',
      })
    }
  });

  addFormVisible.value = false;
}

const handleEditProject = (project: ProjectInfo) => {
  console.log(project);

  const formData = new FormData();
  formData.append('name', project.name);
  formData.append('description', project.description);
  formData.append('risk_threshold', project.risk_threshold);
  formData.append('id', project.index);

  updateProject(formData).then((res: ProjectCreateResponse) => {
    console.log(res);
    if (res.code === 200) {
      ElMessage({
        message: '成功更新',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '更新失败: ' + res.message + ' ' + res.obj,
        type: 'error',
      })
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error('更新失败');
  });
}

const handleDeleteProject = (project: ProjectInfo) => {
  ElMessageBox.confirm('您确定要删除该项目吗?', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(() => {
      console.log(project);
      let formData = new FormData();
      formData.append('id', project.index);

      deleteProject(formData).then((res: ProjectCreateResponse) => {
        console.log(res);
        if (res.code === 200) {
          ElMessage({
            message: '成功删除',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '删除失败: ' + res.message + ' ' + res.obj,
            type: 'error',
          })
        }
      }).catch((err) => {
        console.log(err);
        ElMessage.error('删除失败');
      });
    })
    .catch(() => {

    })
}

// loading-frames
const isLoading = ref(true);


// project list
const projectInfos = reactive<ProjectInfo[]>([]);

async function getProjects(companyId: number) {
  isLoading.value = true;
  const page = 1;
  const pageSize = 10;

  projectInfos.value = [];
  await getProjectList(page, pageSize, companyId).then((res) => {
    let data: ProjectListResponse = res;
    if (data.code !== 200) {
      ElMessage.error('获取项目列表失败');
      console.error(data);
      return;
    }
    for (let i = 0; i < data.obj.length; i++) {
      // let pStatus: ProjectStatus = ProjectStatus.SAFE;
      // if(data.obj[i].risk_level === '高风险'){
      //   pStatus = ProjectStatus.HIGH;
      // }else if(data.obj[i].risk_level === '中风险'){
      //   pStatus = ProjectStatus.ING;
      // }else{
      //   pStatus = ProjectStatus.LOW;
      // }
      projectInfos.push({
        index: data.obj[i].id,
        name: data.obj[i].name,
        description: data.obj[i].description,
        risk_level: data.obj[i].risk_level,
        // pStatus: pStatus
      });
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error('获取项目列表失败');
  });

  isLoading.value = false;
}

onMounted(() => {
  const companyId = 1; // mock data, should be replaced by real data
  getProjects(companyId);
})
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
