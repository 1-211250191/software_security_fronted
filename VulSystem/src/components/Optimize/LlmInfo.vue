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
  box-shadow: rgba(99, 99, 99, 0.116) 0px 2px 8px 0px;
  border-radius: 8px;
  height: 150px;
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

    .right {
      display: flex;
      justify-content: space-around;
    }
  }

  .text {
    flex: 1;
    width: 100%;
    font-size: 14px;
    color: #555557;
    display: -webkit-box;
    /* 为了使用 WebKit 的剪裁 */
    -webkit-box-orient: vertical;
    /* 设置方向为垂直 */
    -webkit-line-clamp: 3;
    line-clamp: 3;
    /* 设置显示的行数 */
    overflow: hidden;
    /* 隐藏超出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
  }

  .footer {
    border-top: 1px solid #efefefd5;
    height: 50px;

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
}
</style>
