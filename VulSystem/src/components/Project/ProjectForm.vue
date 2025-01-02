<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ProjectStatus, type ProjectInfo } from './const';

const props = withDefaults(defineProps<{
  type: 'edit' | 'add'
  classname?: string;
  visible: boolean
  project?: ProjectInfo
}>(), {
  type: 'add'
});
const emit = defineEmits(['cancel', 'confirm']);
const dialogVisible = ref(props.visible);
const newProject = reactive<ProjectInfo>(props.project ??
{
  index: 0,
  title: '',
  desc: '',
  pStatus: ProjectStatus.ING,
  widgt: 10,
})
watch(() => props.visible, (newVal) => {
  console.log(newVal)
  dialogVisible.value = newVal;
});
watch(() => props.project, (project) => {
  Object.assign(newProject, project);
})
</script>

<template>
  <!-- 新增项目的对话框 -->
  <el-dialog v-model="dialogVisible" :title="type == 'add' ? '新增项目' : '编辑项目'" width="600">
    <el-form :model="newProject" label-width="auto" style="max-width: 600px">
      <el-form-item label="项目仓库名">
        <el-input v-model="newProject.title" />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input v-model="newProject.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="检测标准阈值">
        <el-input-number v-model="newProject.widgt" :min="1" :max="20" />
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('cancel')">取消</el-button>
        <el-button type="primary" @click="emit('confirm', newProject)">
          {{ type == 'add' ? '确认添加' : '确认修改' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
