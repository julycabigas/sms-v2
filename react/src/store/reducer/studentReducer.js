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
    },
    deleteStudent(state, action) {
      if (state.studentData.docs) {
        state.studentData.docs.splice(action.payload.index, 1);
      }
    }
  }
})

export const { allStudent, deleteStudent } = studentSlice.actions

export default studentSlice.reducer