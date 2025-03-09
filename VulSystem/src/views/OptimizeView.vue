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

      <DataSetting :threshold-name="stratage?.detectStrategy.endsWith('whiteList') ? '误报过滤阈值' : '相似度阈值'"
        :threshold="stratage?.similarityThreshold ?? 0.5" :K="stratage?.maxDetectNums ?? 1"
        @update:threshold="updateThreshold" @update:K="updateK" />
      <div class="llm-list">
        <LlmInfo v-for="llm in llmList" :key="llm.llmName" :is-vip="stratage?.isMember == 1"
          :is-chosen="llm.llmName == stratage?.detectStrategy" :info="llm" @update:name="updateStratageName" />
      </div>
    </template>
  </DataCard>


</template>

<script setup lang="ts">
import { ArrowRight, Setting, InfoFilled } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import DataSetting from '@/components/Optimize/DataSetting.vue';
import LlmInfo from '@/components/Optimize/LlmInfo.vue';
import type { CompanyStrategy, LlmInfoType } from '@/components/Optimize/const';
import { ElMessage } from 'element-plus';
import { changeStrategy, getStrategy } from '@/components/Optimize/service';
// const chosenLlmName = ref<string>('VulLibMiner')
const llmList = ref<LlmInfoType[]>([
  {
    llmName: 'TinyModel',
    desc: '利用tf-idf打分算法结合基于bert的TinyModel方法进行检测，能够高效识别常见漏洞。',
    accuracy: 0.75,
    falseRate: 0.03
  },
  {
    llmName: 'LLM',
    desc: '在TinyModel的识别基础上，使用大型语言模型（LLM）进行漏洞检测，具有强大的漏洞检测能力。',
    accuracy: 0.85,
    falseRate: 0.01
  },
  {
    llmName: 'LLM-lev',
    desc: '在LLM基础上结合Levenshtein距离相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.90,
    falseRate: 0.015,
  },
  {
    llmName: 'TinyModel-lev',
    desc: '在TinyModel基础上结合Levenshtein距离相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.82,
    falseRate: 0.025
  },
  {
    llmName: 'LLM-cos',
    desc: '在LLM基础上结合余弦相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.88,
    falseRate: 0.018,
    infoTag: '误报率较低',
  },
  {
    llmName: 'TinyModel-cos',
    desc: '在TinyModel基础上结合余弦相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.80,
    falseRate: 0.02,
    infoTag: '误报率较低',
  },
  {
    llmName: 'LLM-lcs',
    desc: '在LLM基础上结合最长公共子序列（LCS）算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.87,
    falseRate: 0.017
  },
  {
    llmName: 'TinyModel-lcs',
    desc: '在TinyModel基础上结合最长公共子序列（LCS）算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.79,
    falseRate: 0.022
  },
  {
    llmName: 'LLM-whiteList',
    desc: '定制化训练的大模型，基于您的企业白名单进行训练，确保高准确率。',
    accuracy: 0.92,
    falseRate: 0.01,
    infoTag: '准确率较高',
    needVip: true,
  },
  {
    llmName: 'TinyModel-whiteList',
    desc: '定制化训练的bert模型，基于您的企业白名单进行训练，确保高准确率。',
    accuracy: 0.83,
    falseRate: 0.02,
    infoTag: '准确率较高',
    needVip: true,
  }
])
// 定义响应式变量
// const threshold = ref<number>(0.5);
// const K = ref<number>(3);


const stratage = ref<CompanyStrategy>()
onMounted(() => {
  getStrategy()
    .then(res => {
      stratage.value = res.data.obj
    })
})
// 更新阈值的处理函数
const updateThreshold = (value: number) => {
  if (stratage.value) {
    stratage.value.similarityThreshold = value
    changeStratage()
  }

};

// 更新 K 值的处理函数
const updateK = (value: number) => {
  if (stratage.value) {
    stratage.value.maxDetectNums = value
    changeStratage()
  }
};
// 监听 detectStrategy 的变化
watch(
  () => stratage.value?.detectStrategy,
  (newValue) => {
    // 将对应策略放到最前面
    const index = llmList.value.findIndex(item => item.llmName === newValue);
    if (index !== -1) {
      const [itemToMove] = llmList.value.splice(index, 1); // 删除原数组中的该项
      llmList.value.unshift(itemToMove); // 将删除的项插入数组最前面
    }
  },
  { immediate: true } // 立即执行一次，确保初始状态正确
);

const updateStratageName = (value: string) => {
  if (stratage.value) {
    stratage.value.detectStrategy = value
    // 将对应策略放到最前面
    // const index = llmList.findIndex(item => item.llmName === value);
    // if (index !== -1) {
    //   const [itemToMove] = llmList.splice(index, 1); // 删除原数组中的该项
    //   llmList.unshift(itemToMove); // 将删除的项插入数组最前面
    // }
    changeStratage()
  }
}

const changeStratage = () => {
  if (stratage.value) {
    changeStrategy(stratage.value)
      .then(() => ElMessage.success('已成功修改配置'))
  }
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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 每行放 3 个卡片 */
  gap: 25px;
  /* 卡片之间的间距，可以根据需要调节 */
  /* padding: 16px; */
  /* 网格容器的内边距 */
}
</style>
