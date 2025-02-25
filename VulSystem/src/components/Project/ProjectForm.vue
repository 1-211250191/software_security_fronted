<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { type ProjectInfo } from './const';
import { QuestionFilled } from "@element-plus/icons-vue";
import LanguageSelector from "@/components/Project/LanguageSelector.vue";
import { ElMessage, type FormInstance, type UploadInstance, type UploadUserFile } from "element-plus";


// props and emits
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
  name: '',
  description: '',
  // pStatus: ProjectStatus.ING,
  risk_level: '暂无风险',
  language: 'java',
  // file: null,
  company: 'Default Company Name',
  risk_threshold: 10,
})
const formRef = ref(null);


// form rules
const rules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  file: [
    { required: true, message: '请上传项目文件', trigger: 'change' }
  ],
  risk_threshold: [
    { required: true, message: '请输入风险阈值', trigger: 'blur' }
  ]
}


// language change
function handleChangeLanguage(language: string) {
  newProject.language = language;
}


// file upload
const uploader = ref<UploadInstance>()
function handleFileChange(file) {
  if (file.size && file.size / 1024 / 1024 > 100) {
    ElMessage.error('文件大小不能超过100MB')
    return
  }
  newProject.file = file.raw;
}
const removeFile = () => {
  newProject.file = null
  if (uploader.value) {
    uploader.value.clearFiles()
  }

}
async function handleConfirmCreate(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      emit('confirm', newProject)
    }
  })
}


// watches
watch(() => props.visible, (newVal) => {
  // console.log(newVal)
  dialogVisible.value = newVal;
});
watch(() => props.project, (project) => {
  Object.assign(newProject, project);
})
</script>

<template>
  <!-- 新增项目的对话框 -->
  <el-dialog v-model="dialogVisible" :title="type == 'add' ? '新增项目' : '编辑项目'" width="600">
    <el-form ref="formRef" :model="newProject" label-width="auto" style="max-width: 600px" :rules="rules">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="newProject.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input v-model="newProject.description" type="textarea" placeholder="请输入项目描述" />
      </el-form-item>
      <el-form-item label="风险阈值" prop="risk_threshold">
        <el-input-number v-model="newProject.risk_threshold" :min="0" :max="20" />
        <div class="tips">
          <el-tooltip content="风险阈值是指项目中漏洞数量超过多少时，项目状态会变为风险状态。<br>当风险阈值为零时，代表高风险风险阈值。" raw-content placement="top">
            <el-icon class="question-icon">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="项目语言" v-if="type == 'add'">
        <LanguageSelector @select="handleChangeLanguage" />
      </el-form-item>
      <el-form-item label="项目文件" prop="file" v-if="type == 'add'">
        <div class="upload-file-container">
          <el-upload ref="uploader" :auto-upload="false" :on-change="handleFileChange" :show-file-list="false"
            :multiple="false">
            <el-button type="primary">选择文件</el-button>
            <div class="tips">
              <el-tooltip content="上传项目依赖文件或编译后的二进制文件。<br>最大可接受的文件大小：100MB。" raw-content placement="top">
                <el-icon class="question-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-upload>
          <div v-if="newProject.file" class="selected-file">
            <span>已选择文件: {{ newProject.file.name }}</span>
            <el-button type="danger" size="small" @click="removeFile" class="remove-button">移除</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('cancel')">取消</el-button>
        <el-button type="primary" @click="handleConfirmCreate(formRef)">
          {{ type == 'add' ? '确认添加' : '确认修改' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.tips {
  display: flex;
  align-items: center;

  margin-left: 10px;
  cursor: pointer;
}

.question-icon {
  color: #9da0a4;
  font-size: 20px;
  line-height: 16px;
  height: 20px;
}

.upload-file-container {
  display: flex;
  flex-direction: column;
  align-items: start;

  span {
    font-size: 13px;
    font-weight: 500;
  }

  .selected-file {
    margin-top: 10px;
  }

  .remove-button {
    margin-left: 10px;
  }
}
</style>
