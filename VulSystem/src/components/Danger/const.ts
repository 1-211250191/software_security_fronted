// Types
export interface DangerInfo {
  label: string
  desc: string
  ref: string
  language: string
  risk: string
  detectTime: string
}

export interface ReportInfo {
  reportName: string // 漏洞报告名
  reportId: string // 编号
  time: string // 披露时间
  isCve: boolean
  isPoc: boolean
  ref:string //漏洞来源
}

// Constants
