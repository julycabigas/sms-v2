import axios from 'axios'

export function onAuthStateChanged(cb) {
  axios.post('/token')
    .then(res => {
      cb({
        access_token: res.data,
        isAuthenticated: true,
      })
    })
    .catch(err => {
      cb({
        isAuthenticated: false,
      })
    })
}