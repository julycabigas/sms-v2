import { createSlice } from '@reduxjs/toolkit'

const user = createSlice({
  name: 'user',
  initialState: {
    userDocs: null,
    isFetching: false,
  },
  reducers: {
    allUserDocs(state, action) {
      state.userDocs = action.payload;
    },
    addUser(state, action) {
      if (state.userDocs) {
        state.userDocs.docs = [...state.userDocs.docs, action.payload];
      }
    }, 
    deleteUser(state, action) {
      state.userDocs.docs = state.userDocs.docs.filter(item => item._id !== action.payload.userId);
    },
    updateUser(state, action) {
      if (state.userDocs) {
        const index = [...state.userDocs.docs].findIndex(item => item._id === action.payload.userId);
        state.userDocs.docs[index] = action.payload.updatedUser;
      }
    }
  }
})

export const { allUserDocs, addUser, updateUser, deleteUser } = user.actions

export default user.reducer