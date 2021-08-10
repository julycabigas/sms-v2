import { createSlice } from '@reduxjs/toolkit'

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    studentData: {},
    isFetching: false,
    error: null,
  },
  reducers: {
    allStudent(state, action) {
      if (action.payload.isFetching) {
        state.studentData = {}
        state.isFetching = true
      } else {
        state.studentData = action.payload.studentData
        state.isFetching = false
      }
    }
  }
})

export const { allStudent } = studentSlice.actions

export default studentSlice.reducer