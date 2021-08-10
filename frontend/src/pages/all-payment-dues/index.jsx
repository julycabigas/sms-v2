import React from 'react'
import Box from 'components/Box'
import { TableWrapper } from '../student/studentStyle'
import BaseLayout from 'layouts/BaseLayout'
import { useHttp } from 'hooks'
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom'

export const Index = () => {
  const http = useHttp()
  const [lists, setLists] = React.useState(null)

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get('/api/student/payment/all-payment-dues')
        if (unmount) setLists(data)
      })()
    }
    return () => unmount = false
  }, [])
  
  return (
    <Wrapper>
      {lists ? (
          lists.map((doc, key) => <List key={key} doc={doc} />)
        ) : (
          <Waiting message="Loading..." />
        )
      }
      {lists && !lists.length && <Waiting message="No Records found." />}
    </Wrapper>
  )
}

export default Index

const Waiting = ({ message }) => (
  <tr>
    <td colSpan="6" className="text-center">{message}</td>
  </tr>
)

const List = ({ doc }) => {
  const history = useHistory()
  return (
    <tr>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.student && doc.student.first_name + ' ' + doc.student.last_name }<br/>
        <span style={{ fontSize: '0.8em' }}>{doc.student && doc.student.email}</span>
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
        >
          {doc.plan && doc.plan.resultName}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {moment(doc.due_date || new Date()).format('ll')}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.amount} {doc.currency}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.status}
      </td>
      <td>
        <Link
          to={`/student/${doc.student._id}#/payment-lists`} 
          className="btn btn-sm btn-outline-primary"
          >View
        </Link>
      </td>
    </tr>
  )
}

const Wrapper = ({ children }) => (
  <BaseLayout>
    <Box 
      title={<>
          All Payment Dues
          <div style={{ fontSize: '0.65em', fontWeight: '400' }}>
            All payment dues that is within 7 days will show up here
          </div>
        </>} 
      hasBackBtn={false}
      maxWidth="100%"
      rightHeader={''}
    >
      <div className="py-3">
        <TableWrapper className="table-responsive">
          <table className="table mb-0">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Payment Plan</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {children}
            </tbody>
          </table>
        </TableWrapper>
      </div>
  </Box>
</BaseLayout>
)
