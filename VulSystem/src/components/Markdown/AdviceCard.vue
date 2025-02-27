<template>
  <DataCard title="问题描述" width="auto" class="advice">
    <template #main>
      <div class="section">
        <div class="line">
          <h2>漏洞库名: </h2>
          <p>{{ info.name }}</p>
        </div>

        <div class="line">
          <h2>漏洞描述: </h2>
          <p>{{ info.description }}</p>
        </div>

        <h2>相关代码: </h2>
        <pre class="code-block"><code>{{ errCode }}</code></pre>

        <!-- <button @click="submitComment">提交评论</button> -->

        <!-- <div v-if="submittedComment">
          <h3>评论提交成功：</h3>
          <p>{{ submittedComment }}</p>
        </div> -->
      </div>
    </template>
  </DataCard>
  <DataCard title="建议" width="auto" class="advice">
    <template #right>
      <el-select v-model="modelName" placeholder="Select" style="width: 240px">
        <el-option v-for="item in modelList" :key="item" :label="item" :value="item" />
      </el-select>

    </template>
    <template #main>
      <MarkdownComponent :markdown="adviceCode" classname="advice-block" />
      <!-- <div class="section">
        <h2>修复步骤: </h2>
        <ol class="fix-steps">

          <li>增强错误处理：当 inode 为 NULL 时，不仅记录错误，还应考虑返回一个更明确的错误代码或状态，以便调用者能够理解发生了什么。
          </li>
          <li>添加更多的权限检查： 除了检查当前用户是否是超级用户（GLOBAL_ROOT_UID）或文件的所有者（inode->i_uid），可以考虑添加对组权限的检查，或是更复杂的权限逻辑，以提高安全性。</li>
          <li>使用适当的日志级别：
            使用更合适的日志级别（如 pr_warn 或 pr_alert），以便在出现关键错误时引起注意。</li>

        </ol>

        <h2>相关代码：</h2>
        <pre class="code-block"><code>{{ adviceCode }}</code></pre>
      </div> -->
    </template>
  </DataCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DangerInfo } from '../Danger/const';
import MarkdownComponent from './MarkdownComponent.vue';
import { getSuggestion } from './service';

const props = withDefaults(
  defineProps<{
    info: DangerInfo
  }>(),
  {
  }
);
const modelName = ref<string>('GPT-4')
const modelList = ['Deepseek', 'GPT-4', 'Gemini']

const errCode = ref<string>(`
static bool check_permission_for_set_tokenid(struct file *file)
{
	const struct cred *cred = get_task_cred(current);
	struct inode *inode = file->f_inode;

	if (inode == NULL) {
		pr_err("%s: file inode is null\n", __func__);
		return false;
	}

	if (uid_eq(cred->uid, GLOBAL_ROOT_UID) ||
	    uid_eq(cred->uid, inode->i_uid)) {
		return true;
	}
`)
const adviceCode = ref<string>(`
**修复建议**
\`\`\`cpp
static bool check_permission_for_set_tokenid(struct file * file)
{
    kuid_t uid = current_uid();
    struct inode *inode = file-> f_inode;

if (inode == NULL) {
  pr_err("%s: file inode is null\n", __func__);
  return false;
}
if (uid_eq(uid, GLOBAL_ROOT_UID) ||
  uid_eq(uid, inode -> i_uid)) {
  return true;
}
\`\`\`
`);

const getAdvice = () => {
  const requestList: [string, string, string, string?] = [props.info.name, props.info.description, modelName.value]
  if (errCode.value != '') {
    requestList.push(errCode.value)
  }
  getSuggestion(...requestList)
    .then(res => {
      adviceCode.value = res.data.obj.fix_advise
    })
}

onMounted(() => {
  getAdvice()
},)
</script>

<style>
.advice {
  margin: 0 !important;

  .card-header {
    .card-title {
      color: #336fff;
      font-weight: bold;
    }
  }
}


.section {
  margin: auto;
  padding: 16px;
  /* border: 1px solid #ddd; */
  border-radius: 8px;
  /* background: #f9f9f9; */

  .line {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  h2 {
    /* margin-top: 16px; */
    font-size: 14px;
    margin-right: 20px;
    color: #4381FF;
  }

  p {
    color: #555557;
  }
}



.fix-steps {
  margin: 10px 0;
  /* 上下间距 */
  padding-left: 20px;
  /* 左边缩进 */
  list-style-type: decimal;
  /* 使用数字编号 */
  color: #3a3a3a;
  /* 步骤字体颜色 */
}

.fix-steps li {
  margin-bottom: 8px;
  /* 每个步骤间距 */
  line-height: 1.5;
  /* 行高 */
  font-size: 14px;
  /* 字体大小 */
  color: #555557;
}

.advice-block {
  pre {
    margin-top: 16px;
    padding: 25px;
    background-color: #EEF0F4;
    /* border: 1px solid #ccc; */
    border-radius: 6px;
    white-space: pre;
    /* 保持换行符 */
    font-family: monospace;
    color: #727375;
  }
}

.code-block {
  margin-top: 16px;
  padding: 25px;
  background-color: #EEF0F4;
  /* border: 1px solid #ccc; */
  border-radius: 4px;
  white-space: pre;
  /* 保持换行符 */
  font-family: monospace;
  color: #727375;
}
</style>
