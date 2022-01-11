import { createSlice } from '@reduxjs/toolkit'

const authUser = createSlice({
  name: 'authUser',
  initialState: {
    access_token: null,
    user: null,
  },
  reducers: {
    getAccessToken(state, action) {
      state.access_token = action.payload.access_token || null;
      state.user = action.payload.user || null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.access_token = null;
      state.user = null;
    }
  }
})

export const { getAccessToken, logoutUser, setUser } = authUser.actions

export default authUser.reducer