<template>
  <div class="chat-frame">

    <div class="chat-header">
      <h1>安全小助手</h1>
      <button class="close-button" @click="$emit('closeBody')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="close-icon">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="chat-messages">

      <div v-for="message in messages" :key="message.timestamp" class="message-container">
        <!-- assistant message -->
        <div class="message assistant-message" v-if="message.isAssistant">
          <div class="avatar assistant-avatar">
            <el-icon style="color: white"><Orange></Orange></el-icon>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>

        <!-- user message -->
        <div class="message user-message" v-else>
          <div class="avatar user-avatar">
            <span>U</span>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- input -->
    <div class="input-area">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="请输入希望问小助手的问题..."
        @keyup.enter="sendMessage"
      >
      <button class="send-button" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {Orange} from "@element-plus/icons-vue";

interface Message {
  content: string
  isAssistant: boolean
  timestamp: number
}

const inputMessage = ref('')
const messages = ref<Message[]>([
  {
    content: '您好！我是您的项目安全漏洞管理助手，随时为您提供安全漏洞的检测、修复建议和管理指导。请问有什么可以帮您？',
    isAssistant: true,
    timestamp: Date.now()
  },
  {
    content: '您好！很高兴遇见您！',
    isAssistant: false,
    timestamp: Date.now()
  }
])

const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  const newMessage: Message = {
    content: inputMessage.value,
    isAssistant: false,
    timestamp: Date.now()
  }

  messages.value.push(newMessage)
  inputMessage.value = ''

  //store only the last 10 messages
  if (messages.value.length > 10) {
    messages.value.shift()
  }

  // simulate assistant response
  setTimeout(() => {
    const assistantResponse: Message = {
      content: '我很乐意帮助您解决问题，请详细描述您遇到的情况。',
      isAssistant: true,
      timestamp: Date.now()
    }
    messages.value.push(assistantResponse)
  }, 1000)
}

const closeChat = () => {
  console.log('关闭聊天')
}
</script>

<style scoped>
.chat-frame {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.chat-header h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 8px;

}

.message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 80%;
}

.user-message {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.avatar {
  min-width: 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-avatar {
  background-color: #4169E1;
}

.user-avatar {
  background-color: #e5e5e5;

  span{
    color: #666;
    font-size: 18px;
    font-weight: bold;
  }
}

.assistant-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

.message-content {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.assistant-message .message-content {
  background-color: #4169E1;
  color: white;
}

.user-message .message-content {
  background-color: #f5f5f5;
  color: #333;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.input-area input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 14px;
  outline: none;
}

.input-area input:focus {
  border-color: #4169E1;
}

.send-button {
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 4px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #3154b3;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (max-width: 480px) {
  .chat-frame {
    height: 100vh;
    max-width: 100%;
    border-radius: 0;
  }

  .message {
    max-width: 90%;
  }
}
</style>
