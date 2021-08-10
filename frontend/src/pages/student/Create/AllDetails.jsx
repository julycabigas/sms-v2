import React, { useCallback, useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Form, BackButton, FormHeader } from '../studentStyle'
import Button from 'react-bootstrap/Button'
import { MdKeyboardBackspace } from "react-icons/md";
import { useHistory, Redirect } from 'react-router-dom'
import { useHttp } from 'hooks'
import styled from 'styled-components'
import { emptyDetails } from 'store/reducer/createStudentReducer'
import scheduleDateLists from 'helpers/scheduleDateLists'

export const AllDetails = ({ student_details, payment_details }) => {
  const history = useHistory()
  const [details, setDetails] = useState({});
  const dispatch = useDispatch()
  const [plan, setPlan] = useState(null)
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const http = useHttp()

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    setDisabledSubmit(true)
    const lists = scheduleDateLists(details.payment_date_start, plan)
    const paymentLists = lists && lists.map(item => ({ 
      due_date: item.date,
      amount: plan && plan.amount,
      status: 'Pending',
      currency: plan && plan.currency,
      plan: plan && plan._id,
    }))
    details.plan = details.payment_plan_id;
    delete details.payment_plan_id;
    const { data } = await http.post('/api/student', {...details, paymentLists})
    if (data) {
      setTimeout(() => {
        setDisabledSubmit(false)
        dispatch( emptyDetails() )
        history.push(`/student/${data.student._id || ''}`)
      }, 300)
    }
    setDisabledSubmit(false)
  }, [details, plan, history, dispatch])

  useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        if (details.payment_plan_id) {
          const { data } =  await http.get(`/api/plan/${details.payment_plan_id}`)
          if (unmount) setPlan(data)
        }
      })()
    }
    return () => {
      unmount = false
    }
  }, [details.payment_plan_id])

  useEffect(() => {
    if (student_details && payment_details) {
      setDetails({...student_details, ...payment_details})
    }
  }, [student_details, payment_details])

  if (!student_details || !payment_details) {
    return <Redirect to="/student/create/1" />
  }

  return (
    <Form style={{ maxWidth: '875px' }} onSubmit={onSubmit}>
      <FormHeader>
        <BackButton type="button" className="btn" onClick={() => history.push('/student/create/2')}>
          <MdKeyboardBackspace />
        </BackButton>
        <h5 className="mb-0 ml-3">Details</h5>
      </FormHeader>

      <div className="pb-4">
        <Row className="row">
          <ColOne details={details} />
          <ColTwo details={details} plan={plan} />
        </Row>

        <div className="text-right">
          <Button type="button" variant="default" className="mr-2" onClick={() => dispatch(emptyDetails())}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={disabledSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  student_details: state.createStudent.student_details,
  payment_details: state.createStudent.payment_details,
})
export default connect(mapStateToProps)(AllDetails)

function ColTwo({details, plan}) {
  const history = useHistory()
  return (
    <div className="col-md-6">
      <div className="text-right">
        <EditBtn className="btn" onClick={() => history.push('/student/create/2')}>Edit</EditBtn>
      </div>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <TitleTd>Deposit:</TitleTd>
              <td>{details && details.deposit && 
              (<>
                <strong>{details.deposit[0].amount} {details.deposit[0].currency}</strong> 
                <span> / {details.deposit[0].date}</span>
              </>)}
            </td>
            </tr>
            <tr>
              <TitleTd>Payment Plan:</TitleTd>
              <td>{plan && plan.resultName}</td>
            </tr>
            <tr>
              <TitleTd>Payment Date Start:</TitleTd>
              <td>{details && details.payment_date_start}</td>
            </tr>
            <tr>
              <TitleTd>Signed Contract:</TitleTd>
              <td>{details && details.signed_contract}</td>
            </tr>
            <tr>
              <TitleTd>Sales Rep:</TitleTd>
              <td>{details && details.sales_rep}</td>
            </tr>
            <tr>
              <TitleTd>Payment Method:</TitleTd>
              <td>{details && details.payment_method}</td>
            </tr>
            <tr>
              <TitleTd>Payment Status:</TitleTd>
              <td>{details && details.payment_status}</td>
            </tr>
            <tr>
              <TitleTd>Joined Date:</TitleTd>
              <td>{details && details.joined_date}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ColOne({details}) {
  const history = useHistory()
  return (
    <div className="col-md-6" style={{ borderRight: '1px solid #eceaea' }}>
      <div className="text-right">
        <EditBtn className="btn" onClick={() => history.push('/student/create/1')}>Edit</EditBtn>
      </div>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <TitleTd>First Name:</TitleTd>
              <td>{details && details.first_name}</td>
            </tr>
            <tr>
              <TitleTd>Last Name:</TitleTd>
              <td>{details && details.last_name}</td>
            </tr>
            <tr>
              <TitleTd>Email:</TitleTd>
              <td>{details && details.email}</td>
            </tr>
            <tr>
              <TitleTd>Phone:</TitleTd>
              <td>{details && details.phone}</td>
            </tr>
            <tr>
              <TitleTd>Country:</TitleTd>
              <td>{details && details.country}</td>
            </tr>
            <tr>
              <TitleTd>Pipeline:</TitleTd>
              <td>{details && details.pipeline}</td>
            </tr>
            <tr>
              <TitleTd>Funnel:</TitleTd>
              <td>{details && details.funnel}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TitleTd = styled.td`
  font-size: 0.9em;
  border-top: none;
`;

const Row = styled.div`
  border-bottom: 1px solid #eceaea;
  margin-bottom: 20px;
  padding: 18px 0;
`;

const EditBtn = styled.button`
  font-size: 0.8em;
  padding: 5px 13px;
  border: 0;
  font-weight: 600;
  background: #f3f3f3;
  border-radius: 7px;
  margin-bottom: 10px;
`;