import { createSlice } from '@reduxjs/toolkit'

const note = createSlice({
  name: 'note',
  initialState: {
    noteDocs: null,
  },
  reducers: {
    allNote(state, action) {
      state.noteDocs = action.payload;
    },
    addNote(state, action) {
      state.noteDocs.docs.push(action.payload);
    },
  }
})

export const { allNote, addNote } = note.actions

export default note.reducer