import axios from '@/utils/request'

export const queryLLM = (query: string, model?: string) => {
  return axios.get(`/llm/query`, {
    baseURL: 'http://localhost:5000',
    params: {
      query,
      model,
    },
  })
}
