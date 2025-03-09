<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { type ProjectInfo } from './const';
import { QuestionFilled } from "@element-plus/icons-vue";
import LanguageSelector from "@/components/Project/LanguageSelector.vue";
import { ElMessage, type FormInstance, type UploadInstance } from "element-plus";


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
  id: 0,
  name: '',
  description: '',
  risk_level: '暂无风险',
  language: 'java',
  companyId: localStorage.getItem('companyId') ?? '',
  risk_threshold: 10,
  filePath: null
})
const formRef = ref<FormInstance>();
const currentFile = ref<File | null>(null);
const fileUploadServerBaseURL = 'http://localhost:8080'; //TODO: change to real server address

// form rules
const rules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  risk_threshold: [
    { required: true, message: '请输入风险阈值', trigger: 'blur' }
  ],
  filePath: [
    { required: true, message: '请上传项目文件', trigger: 'change' }
  ],
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
  if(file.raw.type !== 'application/zip' && file.raw.type !== 'application/x-7z-compressed' && file.raw.type !== 'application/x-tar') {
    ElMessage.error('文件格式不支持，请上传 zip/7z/tar 格式的文件')
    return
  }
  currentFile.value = file.raw;
  console.log("已选择文件: ", currentFile.value)
}
const removeFile = () => {
  currentFile.value = null
  if (uploader.value) {
    uploader.value.clearFiles()
  }
}
const uploadFile = () => {
  if (uploader.value) {
    uploader.value.submit()
  }
}
const handleFileUploadSuccess = (response) => {
  console.log('服务器的响应：', response)
  if (response.code === 200) {
    ElMessage.success('文件上传成功')
    newProject.filePath = response.obj
  } else {
    ElMessage.error('文件上传失败：' + response.message + '，' + response.obj)
    currentFile.value = null
    uploader.value?.clearFiles()
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
      <el-form-item label="项目文件" prop="filePath" v-if="type == 'add'">
        <div class="upload-file-container">
          <el-upload ref="uploader" :auto-upload="false" :on-change="handleFileChange" :show-file-list="false"
            :multiple="false" :action="fileUploadServerBaseURL + '/project/uploadFile'"
            :on-success="handleFileUploadSuccess">
            <el-button type="primary">选择文件</el-button>
            <div class="tips">
              <el-tooltip content="上传项目压缩包，支持 zip/7z/tar 等格式。<br>最大可接受的文件大小：100MB。" raw-content placement="top">
                <el-icon class="question-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-upload>
          <div v-if="currentFile" class="selected-file">
            <span>已选择文件: {{ currentFile.name }}</span>
            <el-button type="danger" size="small" @click="removeFile" class="remove-button"
              v-if="newProject.filePath == null">移除</el-button>
            <el-button type="primary" size="small" @click="uploadFile" v-if="newProject.filePath == null">上传</el-button>
            <div class="upload-success" v-if="newProject.filePath != null">上传成功！</div>
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
    display: flex;
    flex-direction: row;
  }

  .remove-button {
    margin-left: 10px;
  }

  .upload-success {
    color: #67c23a;
    font-weight: bold;
    margin-left: 10px;
  }
}
</style>
