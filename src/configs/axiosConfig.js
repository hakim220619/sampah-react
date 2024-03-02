import axios from 'axios'

const instance = axios.create({
  // .. congigure axios baseURL
  baseURL: `http://127.0.0.1:8000/api`
})
// console.log(instance)
export default instance
