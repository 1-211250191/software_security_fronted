<script setup lang="ts">
import { ref } from 'vue';
import { Edit, Delete, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    thresholdName: string
  }>(),
  {
    thresholdName: '相似度阈值'  // 默认可编辑
  }
);

const threshold = ref<number>(0.5)
const K = ref<number>(3)


</script>

<template>
  <div class="data-setting">
    <!-- Threshold 编辑部分 -->
    <EditableField :label="thresholdName" v-model="threshold" :inputType="'ElSlider'"
      :inputProps="{ min: 0, max: 1, step: 0.05, showInput: true }" />

    <!-- K 值编辑部分 -->
    <EditableField :label="'单位漏洞报告中检测出漏洞库的最大数量'" v-model="K" :inputType="'ElInputNumber'"
      :inputProps="{ min: 1, max: 128 }" />
    <!-- <div class="info">
      <div class="label">{{ thresholdName }}</div>
      <template v-if="threshold.isEdit">
        <el-slider v-model="threshold.data" show-input min="0" max="1" step="0.05" />
        <div class="text">
          <span class="edit" @click="editThreshold">确认修改</span>
          <span class="cancel" @click="cancelThreshold">取消</span>
        </div>
      </template>
<template v-else>
        <div class="data">{{ threshold.data }}</div>
        <div class="text">
          <span class="edit" @click="threshold.isEdit = true">修改</span>
        </div>
      </template>
</div> -->


    <!-- <div class="info">
      <div class="label">单位漏洞报告中检测出漏洞库的最大数量</div>
      <template v-if="K.isEdit">
        <el-input-number v-model="K.data" :min="1" :max="128" />
        <div class="text">
          <span class="edit" @click="editK">确认修改</span>
          <span class="cancel" @click="cancelK">取消</span>
        </div>
      </template>
      <template v-else>
        <div class="data">{{ K.data }}</div>
        <div class="text">
          <span class="edit" @click="K.isEdit = true">修改</span>
        </div>
      </template>
    </div> -->
  </div>



</template>

<style scoped>
.data-setting {
  width: 100%;
  display: flex;
  margin: 5px 0 20px;
  padding: 5px;

  .info {
    flex: 1;
    display: flex;
    align-items: center;

    .label {
      font-size: 14px;
      margin-right: 20px;
      font-weight: normal;
    }

    .text {
      margin-left: 20px;
      font-size: 14px;
      cursor: pointer;

      .edit {
        color: #336FFF;
      }

      .cancel {
        color: #B7B9BD;
      }
    }
  }
}
</style>
