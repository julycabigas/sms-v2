import { createSlice } from '@reduxjs/toolkit'

// deposit: [],
// payment_plan_id: null,
// payment_date_start: null,
// signed_contract: false,
// payment_method: null,
// sales_rep: null,
// status: null,
// joined_date: null,
// first_name: null,
// last_name: null,
// email: null,
// phone: null,
// country: null,
// pipeline: null,
// funnel: null,

export const planSlice = createSlice({
  name: 'createStudent',
  initialState: {
    payment_details: null,
    student_details: null
  },
  reducers: {
    updateStudentDetailsForm: (state, action) => {
      state.student_details = action.payload
    },
    updatePaymentDetailsForm: (state, action) => {
      state.payment_details = action.payload
    },
    emptyDetails: (state) => {
      state.student_details = null
      state.payment_details = null
    }
  }
})  

export const { updateStudentDetailsForm, updatePaymentDetailsForm, emptyDetails } = planSlice.actions

export default planSlice.reducer