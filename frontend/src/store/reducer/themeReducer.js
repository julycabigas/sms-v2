import { createSlice } from '@reduxjs/toolkit'

const theme = createSlice({
  name: 'theme',
  initialState: {
    isDark: false,
  },
  reducers: {
    setTheme(state, action) {
      state.isDark = action.payload
    }
  }
})

export const { setTheme } = theme.actions

export default theme.reducer