import { configureStore } from '@reduxjs/toolkit'
import plan from './reducer/planReducer'
import createStudent from './reducer/createStudentReducer'
import student from './reducer/studentReducer'
import studentDetails from './reducer/studentDetails'
import deposit from './reducer/depositReducer'
import paymentList from './reducer/paymentLists'
import authReducer from './reducer/authReducer'
import theme from './reducer/themeReducer'


export default configureStore({
  reducer: {
    plan,
    createStudent,
    student,
    studentDetails,
    deposit,
    paymentList,
    auth: authReducer,
    theme,
  }
});