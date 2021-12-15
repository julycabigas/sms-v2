import { createSlice } from '@reduxjs/toolkit'

export const planSlice = createSlice({
  name: 'plan',
  initialState: {
    planDocs: {},
    isFetching: false,
    error: null,
    isEdit: false,
    editId: null,
    all: [],
  },
  reducers: {
    setAllPlan: (state, action) => {
      state.all = action.payload;
    },
    fetch: (state, action) => {
      if (action.payload.isFetching) {
        state.isFetching = true
        state.planDocs = {}
      } else {
        state.isFetching = false
        state.planDocs = action.payload.plan
      }
    },
    addDocs: (state, action) => {
      state.planDocs.docs.push(action.payload)
      state.planDocs.totalDocs += 1
    },
    updateDocs: (state, action) => {
      const index = state.planDocs.docs.findIndex(item => item._id === action.payload._id)
      state.planDocs.docs[index] = action.payload.doc;
    },
    isFetching: (state, action) => {
      state.isFetching = action.payload
    },
    setEdit(state, action) {
      state.isEdit = action.payload.isEdit
      state.editId = action.payload._id
    },
    deletePan(state, action) {
      state.planDocs.docs = state.planDocs.docs.filter(item => item._id !== action.payload.planId);
    }
  }
})  

export const { fetch, isFetching, setEdit, updateDocs, addDocs, setAllPlan, deletePan } = planSlice.actions

export default planSlice.reducer