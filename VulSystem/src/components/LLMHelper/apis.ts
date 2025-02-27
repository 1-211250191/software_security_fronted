import axios from '@/utils/request';

export const queryLLM = (query: string, model?: string) => {
  return axios.get(`/openai/common`, {
    params: {
      query,
      model,
    },
  });
}
