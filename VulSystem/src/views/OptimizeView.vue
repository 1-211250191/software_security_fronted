<template>
  <!-- <TestTree /> -->
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/optimize' }">
      <el-icon color="#336FFF" size="14">
        <Setting />
      </el-icon>
      <span class="bread-item">应用优化</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <section>
    <DataSetting :threshold-name="stratage?.detectStrategy.endsWith('whiteList') ? '误报过滤阈值' : '相似度阈值'"
      :threshold="stratage?.similarityThreshold ?? 0.5" :K="stratage?.maxDetectNums ?? 1"
      @update:threshold="updateThreshold" @update:K="updateK" />
    <div class="filter">
      <h4>模型筛选</h4>
      <div class="filter-line">
        <div class="label">模型</div>
        <ul class="filter-list">
          <li v-for="item in modelFilterList" :key="item.value" @click="choosenFilter.model = item.value"
            :class="{ 'chosen': item.value === choosenFilter.model }">
            {{ item.label }}
          </li>
          <!-- <li class="choosen">全部</li>
            <li>预训练模型</li>
            <li>大语言模型</li> -->
        </ul>
      </div>
      <div class="filter-line">
        <div class="label">优化器</div>
        <ul class="filter-list">
          <li v-for="item in optimizeFilterList" :key="item.value" @click="choosenFilter.optimize = item.value"
            :class="{ 'chosen': item.value === choosenFilter.optimize }">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>


    <div class="text">
      <span>共{{ filteredList.length }}个模型，请选择需要的优化策略</span>
      <el-tooltip class="box-item" effect="dark" content="提高阈值能提升检测准确率, 但有可能减少预测结果" placement="bottom">
        <el-icon>
          <InfoFilled />
        </el-icon>
      </el-tooltip>
    </div>
    <div class="llm-list">
      <LlmInfo v-for="llm in filteredList" :key="llm.llmName" :is-vip="stratage?.isMember == 1"
        :is-chosen="llm.llmName == stratage?.detectStrategy" :info="llm" @update:name="updateStratageName" />
    </div>
  </section>

  <!-- <DataCard title="应用优化方案" width="auto">
    <template #main>

    </template>
</DataCard> -->


</template>

<script setup lang="ts">
import { ArrowRight, Setting, InfoFilled } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import { computed, onMounted, ref, watch } from 'vue';
import DataSetting from '@/components/Optimize/DataSetting.vue';
import LlmInfo from '@/components/Optimize/LlmInfo.vue';
import type { CompanyStrategy, LlmInfoType } from '@/components/Optimize/const';
import { ElMessage } from 'element-plus';
import { changeStrategy, getStrategy } from '@/components/Optimize/service';
// import TestTree from '@/components/TestTree.vue';
// const chosenLlmName = ref<string>('VulLibMiner')
const choosenFilter = ref<{ model: string, optimize: string }>({
  model: 'all',
  optimize: 'all'
})
const modelFilterList: Array<{ value: string, label: string, }> = [
  {
    value: 'all',
    label: '全部'
  }, {
    value: 'PreTrain',
    label: '预训练模型',
  }, {
    value: 'LLM',
    label: '大语言模型',
  }
]
const optimizeFilterList: Array<{ value: string, label: string }> = [
  {
    value: 'all',
    label: '全部'
  }, {
    value: 'cos',
    label: '相似度算法优化器',
  }, {
    value: 'whiteList',
    label: '白名单优化器',
  }, {
    value: 'none',
    label: '无'
  }
]
const llmList = ref<LlmInfoType[]>([
  {
    llmName: 'PreTrainModel',
    desc: '利用TF-IDF打分算法结合基于BERT-FNN的PreTrainModel方法进行检测，能够高效识别常见漏洞。',
    accuracy: 0.75,
    falseRate: 0.03
  },
  {
    llmName: 'LLM',
    desc: '在PreTrainModel的识别基础上，使用大语言模型（LLM）进行漏洞检测，具有强大的漏洞检测能力。',
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
    llmName: 'PreTrainModel-lev',
    desc: '在PreTrainModel基础上结合Levenshtein距离相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
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
    llmName: 'PreTrainModel-cos',
    desc: '在PreTrainModel基础上结合余弦相似度匹配算法，与您的企业白名单进行匹配，提升准确率。',
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
    llmName: 'PreTrainModel-lcs',
    desc: '在PreTrainModel基础上结合最长公共子序列（LCS）算法，与您的企业白名单进行匹配，提升准确率。',
    accuracy: 0.79,
    falseRate: 0.022
  },
  {
    llmName: 'LLM-whiteList',
    desc: '在LLM检测的流程中，定制化添加您的企业白名单，确保高准确率。通过阈值过滤的方式降低误报率。',
    accuracy: 0.92,
    falseRate: 0.01,
    infoTag: '准确率较高',
    needVip: true,
  },
  {
    llmName: 'PreTrainModel-whiteList',
    desc: '在PreTrainModel检测的流程中，定制化添加您的企业白名单，确保高准确率。通过阈值过滤的方式降低误报率。',
    accuracy: 0.83,
    falseRate: 0.02,
    infoTag: '准确率较高',
    needVip: true,
  },
  {
    llmName: 'VulDet',
    desc: '基于VulDet的检测，有较好的跨生态系统适配性，较高的版本粒度检测精度',
    accuracy: 0.90,
    falseRate: 0.02
  }
])
// 定义响应式变量
// const threshold = ref<number>(0.5);
// const K = ref<number>(3);

const filteredList = computed(() => {
  const resList = llmList.value
    .filter(item => {
      if (choosenFilter.value.model == 'all') {
        return true;
      } else {
        return item.llmName.startsWith(choosenFilter.value.model)
      }
    })
    .filter(({ llmName }) => {
      const { optimize } = choosenFilter.value;
      if (optimize == 'all') {
        return true;
      } else {
        const hasOptimize = llmName.includes('-');
        const ifWhite = llmName.endsWith('whiteList')
        if (optimize == 'cos') {
          return hasOptimize && !ifWhite;
        } else if (optimize == 'whiteList') {
          return hasOptimize && ifWhite
        } else {
          return !hasOptimize;
        }
      }
    })

  const index = resList.findIndex(item => item.llmName === stratage.value?.detectStrategy);
  if (index !== -1) {
    const [itemToMove] = resList.splice(index, 1); // 删除原数组中的该项
    resList.unshift(itemToMove); // 将删除的项插入数组最前面
  }
  return resList;
})
const stratage = ref<CompanyStrategy>({
  similarityThreshold: 0.7,
  maxDetectNums: 3,
  detectStrategy: "LLM",
  isMember: 1,
})
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
    console.log('change')
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

section {
  padding: 0 20px;
}

.filter {
  margin: 20px 0 20px;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
  /* box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; */


  h4 {
    font-weight: bold;
    margin-bottom: 18px;
    border-bottom: #336FFF solid 1px;
    padding-bottom: 10px;
  }

  .filter-line {
    display: flex;
    align-items: center;
    margin: 8px 0;
    font-size: 14px;


    .label {
      width: 80px;
      color: #7a7979;

    }

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;


      li {
        padding: 5px 10px;
        cursor: pointer;
        margin-right: 20px;
      }

      li:hover,
      .chosen {
        background-color: #ecf5ff;
        border-radius: 5px;
        color: #336FFF;
      }
    }
  }
}

.text {
  margin-bottom: 10px;
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

@media (max-width: 1000px) {
  .llm-list {
    grid-template-columns: repeat(2, 1fr);
    /* 每行放 2 个卡片 */
  }
}

@media (max-width: 700px) {
  .llm-list {
    grid-template-columns: repeat(1, 1fr);
    /* 每行放 2 个卡片 */
  }
}
</style>
