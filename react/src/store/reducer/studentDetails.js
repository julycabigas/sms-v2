import { createSlice } from '@reduxjs/toolkit'

const studentDetails = createSlice({
  name: 'student_details',
  initialState: {
    studentDetails: null,
    isFetching: false,
    error: null,
    isDepositEdit: false,
    editDeposit: {
      index: null,
      isEdit: false,
    }
  },
  reducers: {
    getDetails(state, action) {
      if (action.payload.isFetching) {
        state.studentDetails = null;
      } else {
        state.studentDetails = action.payload.studentDetails;
      }
    },
    setEditDeposit(state, action) {
      state.editDeposit.index = action.payload.index
      state.editDeposit.isEdit = action.payload.isEdit
    }
  }
})

export const { getDetails, setEditDeposit } = studentDetails.actions

export default studentDetails.reducer