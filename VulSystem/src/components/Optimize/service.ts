import axios from '@/utils/request'
import type { CompanyStrategy, StrategyRequest } from './const'
export const changeStrategy = (data: CompanyStrategy) => {
  const companyId = +(localStorage.getItem('companyId') ?? 1)
  const requestData: StrategyRequest = {
    companyId,
  }
  return axios.post('/company/updateStrategy', { ...data, companyId })
}

export const getStrategy = () => {
  const companyId = localStorage.getItem('companyId') || 1
  return axios.get('/company/getStrategy', {
    params: {
      companyId,
    },
  })
}
