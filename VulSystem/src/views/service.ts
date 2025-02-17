import axios from '../utils/request'

export const api = {
  login(username: string, password: string) {
    console.log(username, password)
    return axios.post('')
  },

  register(info) {
    console.log(info)
    return axios.post('')
  },

  getProjectDetail(projectId: number) {
    return axios.get('/project/info', {
      params: {
        projectid: projectId,
      },
    })
  },

  getVulList(projectId: number) {
    return axios.get('/project/getVulnerabilities', {
      params: {
        id: projectId,
      },
    })
  },
}
