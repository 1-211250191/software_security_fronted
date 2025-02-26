import instance from '@/utils/request.ts'
import axios from '@/utils/request'
export interface VulnerabilityReportListResponse {
  code: number
  message: string
  obj: Obj

  [property: string]: any
}

export interface Obj {
  countId: null
  current: number
  maxLimit: null
  optimizeCountSql: boolean
  orders: string[]
  pages: number
  records: Record[]
  searchCount: boolean
  size: number
  total: number

  [property: string]: any
}

export interface Record {
  affectsWhitelist: number
  disclosureTime: string
  id: number
  referenceLink: string
  riskLevel: string
  vulnerabilityName: string
  cveId: string
  isDelete: number

  [property: string]: any
}

export interface VulnerabilityReportSearchResponse {
  code: number
  message: string
  obj: Record[]
}

export const getVulnerabilityReportList = (page: number, size: number) => {
  return new Promise((resolve, reject): VulnerabilityReportListResponse => {
    instance
      .get(`/vulnerabilityReport/list?page=${page}&size=${size}`)
      .then((res: AxiosResponse<VulnerabilityReportListResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export const getVulnerabilityReportSearch = (keyword: string) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`/vulnerabilityReport/search?keyword=${keyword}`)
      .then((res: AxiosResponse<VulnerabilityReportSearchResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export const acceptVul = (vulnerabilityid: number, ifaccept: 1 | 2) => {
  return axios.get('/vulnerability/accept', {
    params: {
      // vulnerabilityid,
      vulnerabilityid,
      ifaccept,
    },
  })
}
