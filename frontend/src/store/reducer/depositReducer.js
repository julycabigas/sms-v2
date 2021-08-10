import { createSlice } from '@reduxjs/toolkit'

const deposit = createSlice({
  name: 'deposit',
  initialState: {
    deposit: []
  },
  reducers: {
    allDeposit: (state, action) => {
      state.deposit = action.payload
    },
    addDeposit: (state, action) => {
      state.deposit = [...state.deposit, action.payload]
    },
    updateDeposit: (state, action) => {
      const index = state.deposit.findIndex(item => item._id === action.payload._id)
      state.deposit[index] = action.payload.deposit
    },
    deleteDeposit: (state, action) => {
      const depositIndex = state.deposit.findIndex(item => item._id === action.payload._id)
      state.deposit = state.deposit.filter((item, index) => index !== depositIndex)
    }
  }
})

export const { allDeposit, updateDeposit, deleteDeposit, addDeposit } = deposit.actions

export default deposit.reducer