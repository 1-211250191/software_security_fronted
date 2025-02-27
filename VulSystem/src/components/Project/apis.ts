import instance from '@/utils/request.ts'

export interface ProjectCreateResponse {
  code: number
  message: string
  obj: never

  [property: string]: never
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
  [property: string]: never
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
  [property: string]: never
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
