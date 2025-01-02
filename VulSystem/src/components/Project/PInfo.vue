<script setup lang="ts">
import { computed, ref } from 'vue';
import { ProjectStatus, type ProjectInfo } from './const';
import { Edit, Delete, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    project: ProjectInfo;
    classname?: string;
    canEdit?: boolean;
  }>(),
  {
    canEdit: true  // 默认可编辑
  }
);
const emit = defineEmits(['edit', 'delete']);

type Tags = {
  [key in ProjectStatus]: { color: string, bgc: string, text: string };
};
const statusTag = computed(() => {
  const tags: Tags = {
    [ProjectStatus.HIGH]: {
      color: '#FF5340',
      bgc: '#FFF4F1',
      text: '高危 ' + (props.project.danger ?? 0)
    },
    [ProjectStatus.ING]: {
      color: '#336FFF',
      bgc: '#E5EFFF',
      text: '分析中'
    },
    [ProjectStatus.LOW]: {
      color: '#FE8B00',
      bgc: '#FFF5EB',
      text: '中危 ' + (props.project.danger ?? 0)
    },
    [ProjectStatus.SAFE]: {
      color: '#3EC01E',
      bgc: '#E4FBE5',
      text: '暂无漏洞'
    }
  }
  return tags[props.project.pStatus]
})

const isOpen = ref(false)
const handleOpen = () => isOpen.value = !isOpen.value

const editFormVisible = ref(false);

const handleEdit = (project: ProjectInfo) => {
  emit('edit', project);
  editFormVisible.value = false;
}

</script>

<template>
  <div class="project-card" :class="classname">
    <div class="card-header">
      <div class="left">
        <h2 class="card-title" @click="$router.push({ path: `/projects/info/${project.title}` });">{{ project.title }}
        </h2>
        <el-text truncated type="info" size="small">{{ project.desc }}</el-text>
      </div>
      <div class="right">
        <div class="tag" :style="{ backgroundColor: statusTag.bgc, color: statusTag.color }"
          @click="$router.push({ path: `/projects/info/${project.title}` });">{{ statusTag.text }}
        </div>
        <el-icon v-show="canEdit" class="project-icon" @click="editFormVisible = true">
          <Edit />
        </el-icon>
        <el-icon v-show="canEdit" class="project-icon" @click="emit('delete', project.index)">
          <Delete />
        </el-icon>
        <el-icon class="project-icon" @click="handleOpen">
          <ArrowDown v-if="isOpen" :style="{ color: '#336fff' }" />
          <ArrowRight v-else />
        </el-icon>
      </div>
    </div>
    <div class="detail" v-if="isOpen">
      <div class="text">检测标准阈值: {{ project.widgt ?? 10 }}</div>
    </div>
  </div>
  <ProjectForm type="edit" :visible="editFormVisible" @cancel="() => editFormVisible = false" @confirm="handleEdit"
    :project="project" />
</template>

<style scoped>
.project-card {
  flex: 1;
  border-radius: 5px;
  background-color: #fff;
  margin: 25px;

}

.card-header {
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;

  .left {
    flex: 1;

    .card-title {
      font-size: 15px;
      /* margin-bottom: 10px; */
      cursor: pointer;
    }
  }


  .right {
    display: flex;

    .tag {
      padding: 0 10px;
      height: 20px;
      border-radius: 10px;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
    }

    .project-icon {
      font-size: 20px;
      color: #808080;
      margin-left: 8px;
      cursor: pointer;
    }
  }
}

.detail {
  width: 100%;
  background-color: #dedfe03f;
  padding: 15px;

  .text {
    color: #666;
    font-size: 12px;
  }
}
</style>
