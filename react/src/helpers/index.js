import axios from 'axios'

export function onAuthStateChanged(cb) {
  axios.post('/token')
    .then(({ data }) => {
      cb({
        access_token: data.token,
        user: data.user,
        isAuthenticated: true,
      })
    })
    .catch(err => {
      cb({
        isAuthenticated: false,
      })
    })
}