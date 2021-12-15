import { createSlice } from '@reduxjs/toolkit'

const authUser = createSlice({
  name: 'authUser',
  initialState: {
    access_token: null
  },
  reducers: {
    getAccessToken(state, action) {
      state.access_token = action.payload.access_token || null;
    },
    logoutUser(state) {
      state.access_token = null;
    }
  }
})

export const { getAccessToken, logoutUser } = authUser.actions

export default authUser.reducer