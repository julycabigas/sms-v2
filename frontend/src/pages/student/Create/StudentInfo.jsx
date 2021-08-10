import React, { useCallback, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Form, BackButton, FormHeader } from '../studentStyle'
import { Input, Select } from 'components/Forms'
import Button from 'react-bootstrap/Button'
import { MdKeyboardBackspace } from "react-icons/md"
import { BsArrowRight } from "react-icons/bs"
import { useForm } from "react-hook-form"
import { funnels, pipelines } from 'helpers/dropdown'
import { updateStudentDetailsForm, emptyDetails } from 'store/reducer/createStudentReducer'
import { useHistory } from 'react-router-dom'

export const Create = (props) => {
  const { register, handleSubmit, setValue } = useForm()
  const dispatch = useDispatch()
  const history = useHistory()
  const [disabledSubmit, setDisabledSubmit] = React.useState(false);

  const onSubmit = useCallback((data) => {
    setDisabledSubmit(true)
    dispatch(updateStudentDetailsForm(data))
    setTimeout(() => {
      setDisabledSubmit(false)
      history.push('/student/create/2')
    }, 300)
  }, [dispatch, history])

  useEffect(() => {
    if (props.student_details) {
      for (const [key, value] of Object.entries(props.student_details)) {
        setValue(key, value)
      }
    }
  }, [props.student_details, setValue])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        <BackButton type="button" className="btn" onClick={() => history.push('/student')}>
          <MdKeyboardBackspace />
        </BackButton>
        <h5 className="mb-0 ml-3">Student Info</h5>
      </FormHeader>
      <div className="py-4">
        <FormGroup>
          <Input label="First Name" placeholder="First Name"
            {...register('first_name', { required: true })}
          />
        </FormGroup>
        <FormGroup>
          <Input label="Last Name" placeholder="Last Name"
            {...register('last_name', { required: true })}
          />
        </FormGroup>
        <FormGroup>
          <Input type="email" label="Email" placeholder="Email" 
            {...register('email', { required: true })}
          />
        </FormGroup>
        <FormGroup>
          <Input type="tel" label="Phone" placeholder="Phone" 
            {...register('phone', { required: true })}
          />
        </FormGroup>
        <FormGroup>
          <Input label="Country" placeholder="Country" 
            {...register('country')}
          />
        </FormGroup>
        <FormGroup>
          <Select label="Pipeline" 
            {...register('pipeline')}
            options={['', ...pipelines].map(value => ({ value }))}
          />
        </FormGroup>
        <FormGroup>
          <Select label="Funnel" 
            {...register('funnel')}
            options={['', ...funnels].map(value => ({ value }))}
          />
        </FormGroup>
        <div className="text-right">
          <Button type="button" variant="default" className="mr-2" 
            onClick={() => {
              dispatch(emptyDetails()); 
              history.push('/student');
            }}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={disabledSubmit}>
            Next <BsArrowRight />
          </Button>
        </div>
      </div>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  student_details: state.createStudent.student_details
})
export default connect(mapStateToProps)(Create)

function FormGroup({ children }) {
  return (
    <div className="form-group">
      {children}
    </div>
  )
}