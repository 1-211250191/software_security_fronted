<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/optimize' }">
      <el-icon color="#336FFF" size="14">
        <Setting />
      </el-icon>
      <span class="bread-item">应用优化</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <DataCard title="应用优化方案" width="auto">
    <template #main>
      <div class="text">
        <span>共{{ llmList.length }}个模型，请选择需要的优化策略</span>
        <el-tooltip class="box-item" effect="dark" content="提高阈值能提升检测准确率, 但有可能减少预测结果" placement="bottom">
          <el-icon>
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </div>

      <DataSetting threshold-name="相似度阈值" :threshold="stratage.similarityThreshold" :K="stratage.maxDetectNums"
        @update:threshold="updateThreshold" @update:K="updateK" />
      <div class="llm-list">
        <LlmInfo v-for="llm in llmList" :key="llm.llmName" :is-vip="false"
          :is-chosen="llm.llmName == stratage.detect_strategy" :info="llm" @update:name="updateStratageName" />
      </div>
    </template>
  </DataCard>


</template>

<script setup lang="ts">
import { ArrowRight, Setting, InfoFilled } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import { reactive, ref } from 'vue';
import DataSetting from '@/components/Optimize/DataSetting.vue';
import LlmInfo from '@/components/Optimize/LlmInfo.vue';
import type { LlmInfoType } from '@/components/Optimize/const';
import { api } from './service';
import { ElMessage } from 'element-plus';
// const chosenLlmName = ref<string>('VulLibMiner')
const llmList = reactive<LlmInfoType[]>([
  {
    llmName: 'VulLibMiner',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner2',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner3',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    needVip: true,
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner4',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner5',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner6',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    infoTag: '准确率较高',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner7',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner8',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    infoTag: '误报率较低',
    accuracy: 0.7,
    falseRate: 0.02
  }, {
    llmName: 'VulLibMiner9',
    desc: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    accuracy: 0.7,
    falseRate: 0.02
  },
])
// 定义响应式变量
// const threshold = ref<number>(0.5);
// const K = ref<number>(3);

interface StratageRequest {
  companyId: number;
  /**
   *
   * 检测策略：共十种(LLM,TinyModel,LLM-lev;TinyModel-lev,LLM-cos;TinyModel-cos,LLM-lcs;TinyModel-lcs,LLM-whiteList;TinyModel-whiteList)
   */
  detect_strategy: string;
  /**
   * 单位漏洞报告中检测出漏洞库的最大数量 1~3
   */
  maxDetectNums: number;
  /**
   * 相似度阈值 0~1
   */
  similarityThreshold: number;
}
const stratage = ref<StratageRequest>({
  companyId: 1,
  detect_strategy: 'VulLibMiner',
  maxDetectNums: 1,
  similarityThreshold: 0.5
})
// 更新阈值的处理函数
const updateThreshold = (value: number) => {
  stratage.value.similarityThreshold = value
  changeStratage()
};

// 更新 K 值的处理函数
const updateK = (value: number) => {
  stratage.value.maxDetectNums = value
  changeStratage()
};

const updateStratageName = (value: string) => {
  stratage.value.detect_strategy = value
  // 将对应策略放到最前面
  const index = llmList.findIndex(item => item.llmName === value);
  if (index !== -1) {
    const [itemToMove] = llmList.splice(index, 1); // 删除原数组中的该项
    llmList.unshift(itemToMove); // 将删除的项插入数组最前面
  }
  changeStratage()
}

const changeStratage = () => {
  api.changeStratage(stratage.value)
    .then(res => ElMessage.success('已成功修改配置'))
}

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

.text {
  margin-top: 10px;
  padding: 5px;
  display: flex;
  /* align-items: bottom; */

  span {
    font-size: 14px;
    color: #555557;
    margin-right: 10px;
  }

  .el-icon {
    font-size: 16px;
    padding-top: 6px;
  }
}

.llm-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 每行放 3 个卡片 */
  gap: 25px;
  /* 卡片之间的间距，可以根据需要调节 */
  /* padding: 16px; */
  /* 网格容器的内边距 */
}
</style>
