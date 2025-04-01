<script setup lang="ts">
import type { LlmInfoType } from './const';

withDefaults(
  defineProps<{
    info: LlmInfoType
    isChosen: boolean
    isVip: boolean
  }>(),
  {
    isChosen: false,// 默认未被选择
    isVip: false
  }
);

const emit = defineEmits(['update:name'])


</script>

<template>
  <div class="llm-card">
    <div class="header">
      <h4>{{ info.llmName }}</h4>
      <div class="right">
        <div v-if="info.infoTag" class="tag" :style="{ backgroundColor: '#E4FBE5', color: '#3EC01E' }">{{ info.infoTag
        }}
        </div>
        <div v-if="info.needVip" class="tag" :style="{ backgroundColor: '#FFF5EB', color: '#FE8B00' }">会员专享</div>
        <el-tag v-if="isChosen" type="primary">已选择</el-tag>
      </div>

    </div>
    <div class="text">{{ info.desc }}</div>
    <div class="footer">
      <div class="data-info">
        <!-- <div class="data-block">
          <div class="pointer" :style="{ backgroundColor: '#87AE6C' }"></div>
          <div class="data">准确率: {{ info.accuracy }}</div>
        </div> -->
        <!-- <div class="data-block">
          <div class="pointer" :style="{ backgroundColor: '#F9C55E' }"></div>
          <div class="data">误报率: {{ info.falseRate }}</div>
        </div> -->
      </div>
      <el-button class="llm-button" v-if="!info.needVip || (info.needVip && isVip)" type="primary"
        @click="emit('update:name', info.llmName)">
        选用该模型
      </el-button>
      <div class="no-vip" v-if="info.needVip && !isVip">非会员无法使用</div>
    </div>
  </div>

</template>

<style scoped>
.llm-card {
  cursor: pointer;
  padding: 10px 15px;
  padding-bottom: 0;
  background-color: #fff;
  /* box-shadow: rgba(99, 99, 99, 0.116) 0px 2px 8px 0px; */
  border-radius: 8px;
  /* height: 160px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header,
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header {
    margin-bottom: 10px;

    h4 {
      font-weight: 600;
    }

    .right {
      display: flex;
      justify-content: space-around;
    }
  }

  .text {
    /* flex: 1; */
    height: 68px;
    width: 100%;
    font-size: 14px;
    color: #555557;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .footer {
    /* border-top: 1px solid #efefefd5; */
    height: 40px;

    .data-info {
      display: flex;

      .data-block {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }

      .pointer {
        height: 10px;
        width: 10px;
        border-radius: 5px;
        margin-right: 5px;
      }

      .data {
        font-size: 12px;
      }
    }

    .llm-button {
      display: none;
      /* margin-bottom: 20px; */
    }

    .no-vip {
      font-size: 10px;
      color: #8B8C8F;
    }

  }

}

.llm-card:hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  transform: translateY(-5px);
  transition: all 0.5s;

  .llm-button {
    display: block;
    position: relative;
    bottom: 10px;
  }
}

.tag {
  padding: 0 10px;
  height: 20px;
  border-radius: 10px;
  font-size: 10px;
  line-height: 20px;
  cursor: pointer;
  margin: 0 5px;
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; */
}
</style>
