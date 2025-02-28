import instance from '@/utils/request.ts'
import axios from '@/utils/request'
import { AxiosError, type AxiosResponse } from 'axios'
import type { ProjectInfo } from './const'

export interface ProjectCreateResponse {
  code: number
  message: string
  obj: never

  // [property: string]: never
}

export const createProject = (project: FormData) => {
  return new Promise((resolve, reject): ProjectCreateResponse => {
    instance
      .post(`/project/create`, project)
      .then((res: AxiosResponse<ProjectCreateResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export const updateProject = (project: FormData) => {
  return new Promise((resolve, reject): ProjectCreateResponse => {
    instance
      .post(`/project/update`, project)
      .then((res: AxiosResponse<ProjectCreateResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export const deleteProject = (project: FormData) => {
  return new Promise((resolve, reject): ProjectCreateResponse => {
    instance
      .post(`/project/delete`, project)
      .then((res: AxiosResponse<ProjectCreateResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export interface ProjectListResponse {
  code: number
  message: string
  obj: Obj[]
  // [property: string]: never
}

export interface Obj {
  id: number
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

  /**
   * 项目风险阈值
   */
  risk_threshold?: string
  // [property: string]: any
  // [property: string]: never
}

export const getProjectList = (page: number, size: number, companyId: number) => {
  return new Promise((resolve, reject): ProjectListResponse => {
    instance
      .get(`/project/list?page=${page}&size=${size}&companyId=${companyId}`)
      .then((res: AxiosResponse<ProjectListResponse>) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        console.error(err)
        reject(err)
      })
  })
}

export const getVulProjectList = async () => {
  const companyId = +(localStorage.getItem('companyId') ?? 1)
  const res = await axios.get(`/project/list?page=${1}&size=${20}&companyId=${companyId}`)
  // 获取列表数据后，筛选出风险项目并排序
  const projectInfos: Obj[] = res.data.obj
  // 1. 筛选出 risk_level 不等于 "暂无风险" 的项目
  const filteredProjects = projectInfos.filter(
    (project) => project.risk_level && project.risk_level !== '暂无风险',
  )
  // 2. 按 "高风险" > "中风险" > "低风险" 的顺序排序
  const riskOrder: { [key_1: string]: number } = { 高风险: 1, 中风险: 2, 低风险: 3 }
  const sortedProjects = filteredProjects.sort((a, b) => {
    const aRisk = a.risk_level ? riskOrder[a.risk_level] || Infinity : Infinity
    const bRisk = b.risk_level ? riskOrder[b.risk_level] || Infinity : Infinity
    return aRisk - bRisk
  })
  // 3. 将 Obj 转换为 ProjectInfo
  const transformedProjects: ProjectInfo[] = sortedProjects.map((project_1) => ({
    description: project_1.description || '',
    id: project_1.id ? +project_1.id : 0,
    name: project_1.name || '',
    risk_level: project_1.risk_level || '',
    risk_threshold: project_1.risk_threshold ? parseInt(project_1.risk_threshold, 10) : 0,
    // 设置默认值，只是为了满足类型定义，不会用到
    companyId: companyId + '',
    language: 'java',
    filePath: null,
  }))
  return transformedProjects
}
