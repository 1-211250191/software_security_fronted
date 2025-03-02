import axios from '@/utils/request'

export const acceptVul = (vulnerabilityid: number, ifaccept: 1 | 2) => {
  return axios.get('/vulnerability/accept', {
    params: {
      // vulnerabilityid,
      vulnerabilityid,
      ifaccept,
    },
  })
}

export const getSuggestion = (name: string, desc: string, model: string, code?: string) => {
  return axios.post('/llm/repair/suggestion', {
    vulnerability_name: name,
    vulnerability_desc: desc,
    related_code: code,
    model,
  })
}
