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
}
