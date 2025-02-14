export enum ProjectStatus {
  'SAFE',
  'LOW',
  'HIGH',
  'ING',
}

export interface ProjectInfo {
  // index: number
  // title: string
  // desc: string
  // pStatus: ProjectStatus
  // danger?: number
  // widgt?: number

  /**
   * 项目描述
   */
  description: string
  /**
   * 项目名
   */
  name: string
  /**
   * 项目风险等级，高风险/低风险/暂无风险
   */
  risk_level: string
}

export interface ProjectInfoDetail {
  id: number
  /**
   * 项目描述
   */
  projectDescription: string
  /**
   * 项目名称
   */
  projectName: string
  /**
   * 检测标准阈值
   */
  riskThreshold: number
  /**
   * 创建时间
   */
  createTime: string

  // description: string
  /**
   * 高风险漏洞数量
   */
  highRiskNum: number
  /**
   * 项目语言
   */
  language: string
  /**
   * 最后扫描时间
   */
  lastScanTime: string
  lowRiskNum: number
  midRiskNum: number
  // name: string
}

// export interface ProjectInfoDetail {
//   index: number
//   title: string
//   desc: string
//   pStatus: ProjectStatus
//   danger?: number
//   widgt?: number
//   createTime?: string
//   detectTime?: string
//   language?: string
// }
