import axios from 'axios'

export function onAuthStateChanged(cb) {
  axios.post('/token')
    .then(({ data }) => {
      const user = data.user;
      delete user.password;
      cb({
        access_token: data.access_token,
        user,
      })
    })
    .catch(err => {
      cb({
        access_token: null,
        user: null,
      })
    })
}