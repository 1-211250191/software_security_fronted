<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="bread">
    <el-breadcrumb-item :to="{ path: '/users' }">
      <el-icon size="14">
        <Discount />
      </el-icon>
      <span class="bread-item">用户中心</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <DataCard title="个人信息" width="auto">
    <template #main>
      <div class="user-name">
        <div class="user-icon">
          <el-icon>
            <UserFilled />
          </el-icon>
        </div>
        <h4>用户名</h4>
      </div>
      <div class="user-infos">
        <div class="info">
          <div class="label">
            职位
          </div>
          <div class="text">
            总经理
          </div>
        </div>
        <div class="info">
          <div class="label">
            手机号
          </div>
          <div class="text">
            134*********
          </div>
        </div>
        <div class="info">
          <div class="label">
            办公邮箱
          </div>
          <div class="text">
            23********@qq.com
          </div>
        </div>
        <div class="info">
          <div class="label">
            是否是会员
          </div>
          <div class="tag" :style="{ backgroundColor: '#FFF5EB', color: ' #FE8B00' }"> VIP
          </div>
        </div>
        <div class="info">
          <div class="label">
            所属团队
          </div>
          <div class="text">
            某事业部
          </div>
        </div>
      </div>
    </template>
  </DataCard>


</template>

<script setup lang="ts">
import { ArrowRight, Discount, UserFilled } from '@element-plus/icons-vue'
import DataCard from '@/components/DataCard.vue';
import { onMounted, reactive, ref, watch } from 'vue';


onMounted(() => {
  // getStrategy()
  //   .then(res => {
  //     stratage.value = res.data.obj
  //   })
})



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



.user-name {
  display: flex;
  align-items: center;
  margin: 20px 10px;

  .user-icon {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #336fff;
  }

  h4 {
    /* font-weight: bold; */
    margin-left: 10px;
    /* font-size: 24px; */
  }
}

.user-infos {
  display: flex;
  justify-content: space-between;
  margin: 20px 10px;
  margin-right: 20px;

  .info {
    display: flex;
    flex-direction: column;

    .label {
      color: #666;
      font-size: 12px;
    }

    .text {
      font-size: 14px;
    }

    .tag {
      padding: 4px 15px;
      /* height: 20px; */
      border-radius: 10px;
      font-size: 12px;
      /* line-height: 20px; */
      cursor: pointer;
      margin-right: 10px;
      font-weight: bold;

    }
  }
}
</style>
