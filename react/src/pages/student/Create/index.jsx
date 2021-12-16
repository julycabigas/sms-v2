import React from 'react'
import { connect } from 'react-redux'
import { FormWrapper } from '../studentStyle'
import { useParams } from 'react-router-dom'

const StudentInfo =  React.lazy(() => import('./StudentInfo'));
const PaymentInfo =  React.lazy(() => import('./PaymentInfo'));
const AllDetails =  React.lazy(() => import('./AllDetails'));

export const Index = () => {
  const { stepId } = useParams()

  return (
    <FormWrapper>
      <React.Suspense fallback={<p></p>}>
        {stepId === '1' && <StudentInfo />}
        {stepId === '2' && <PaymentInfo />}
        {stepId === '3' && <AllDetails />}
      </React.Suspense>
    </FormWrapper>
  )
}

const mapStateToProps = (state) => ({})
export default connect(mapStateToProps)(Index)
