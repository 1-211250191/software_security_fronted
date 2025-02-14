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
    return axios({
      method: 'get',
      url: `/project/statistics?companyId=${projectId}`,
    })
  },
}
