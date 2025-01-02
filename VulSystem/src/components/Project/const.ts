export enum ProjectStatus {
  'SAFE',
  'LOW',
  'HIGH',
  'ING',
}

export interface ProjectInfo {
  index: number
  title: string
  desc: string
  pStatus: ProjectStatus
  danger?: number
  widgt?: number
}

export interface ProjectInfoDetail {
  index: number
  title: string
  desc: string
  pStatus: ProjectStatus
  danger?: number
  widgt?: number
  createTime?: string
  detectTime?: string
}
