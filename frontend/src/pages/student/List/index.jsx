import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { allStudent } from 'store/reducer/studentReducer'
import moment from 'moment'
import { TableWrapper } from '../studentStyle'
import { useQuery, useHttp } from 'hooks'
import { PaginationWrapper } from 'styled'
import Pagination from 'components/Pagination'
import Box from 'components/Box'
import SearchBar from './SearchBar'
import { useHistory } from 'react-router-dom'

export const Index = ({ match, student, studentData, totalDocs }) => {
  const dispatch = useDispatch()
  const query = useQuery()
  const queries = query.toString()
  const http = useHttp()

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        dispatch( allStudent({ isFetching: true }) )
        const res = await http.get('/api/student?' + queries)
        if (res.data) {
          if (unmount) dispatch( allStudent({ isFetching: false, studentData: res.data }) )
        }
      })()
    }
    return () => unmount = false
  }, [dispatch, queries])

  return (
    <>
      <SearchBar />
      <Box 
        title="Student" 
        hasBackBtn={false}
        maxWidth="100%"
        rightHeader={(
          <Link 
            className="btn btn-sm btn-primary" 
            to={`${match.url}/create/1`}>
            Create Student
          </Link>
        )}
      >
        <div className="py-3">
          <ListWrapper isFetching={student && student.isFetching}>
            {studentData && studentData.docs && studentData.docs.map((doc, key) => (
              <Lists key={key} doc={doc} match={match} />
            ))}
            {totalDocs === 0 && (
              <tr><td colSpan="7" className="text-center">No Records Found.</td></tr>
            )}
          </ListWrapper>
          
          {studentData && studentData.totalDocs > studentData.limit && <PaginationWrapper>
            <Pagination 
              totalPages={studentData && studentData.totalPages}
              current={studentData && studentData.page}
            />
          </PaginationWrapper>}
        </div>
      </Box>
    </>
  )
}

const mapStateToProps = (state) => ({
  student: state.student,
  totalDocs: state.student.studentData && state.student.studentData.totalDocs,
  studentData: state.student.studentData
})
export default connect(mapStateToProps)(Index)

const ListWrapper = ({ isFetching, children }) => (
  <TableWrapper className="table-responsive">
    <table className="table mb-0">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Payment Plan</th>
          <th>Contract Signed</th>
          <th>Sales Rep</th>
          <th>Status</th>
          <th>Joined Date</th>
          <th>Action</th>
        </tr>
        {isFetching ? (
          <tr><td colSpan="7" className="text-center">Loading...</td></tr>
        ) : children}
      </tbody>
    </table>
  </TableWrapper>
)

const Lists = ({ doc, match }) => {
  const history = useHistory()
  return (
    <tr>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>
        {doc.first_name} {doc.last_name}
        <br/>
        <span style={{ fontSize: '0.8em' }}>{doc.email}</span>    
      </td>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>{doc.plan.length && doc.plan[0].resultName}</td>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>{doc.signed_contract}</td>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>{doc.sales_rep}</td>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>{doc.payment_status}</td>
      <td onClick={() => history.push(`${match.url}/${doc._id}`)}>{moment(doc.joined_date).format('MMM DD, YYYY')}</td>
      <td>
        <Link to={`${match.url}/${doc._id}`} className="btn btn-sm text-primary mr-2">View</Link>
      </td>
    </tr>
  )
}
