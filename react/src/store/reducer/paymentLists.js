import { createSlice } from '@reduxjs/toolkit'

const paymentList = createSlice({
  name: 'payment_list',
  initialState: {
    payment: {},
    isFetching: false,
    error: null,
  },  
  reducers: {
    allPaymentList(state, action) {
      if (action.payload.isFetching) {
        state.payment = {
          docs: [],
          totalDocs: 0,
          totalPages: 0,
          page: 0,
        }
        state.isFetching = true
      } else {
        state.payment = action.payload.payment
        state.isFetching = false
      }
    },
    updatePaymentList(state, action) {
      state.payment.docs[action.payload.index] = action.payload.paymentData
    },
    deletePaymentList(state, action) {
      state.payment.docs = state.payment.docs.filter((item, index) => index !== action.payload.index)
    },
    addPaymentList(state, action) {
      state.payment.docs = [...state.payment.docs, action.payload.data]
      state.payment.totalDocs += 1
    },
  }
})

export const { allPaymentList, updatePaymentList, deletePaymentList, addPaymentList } = paymentList.actions

export default paymentList.reducer