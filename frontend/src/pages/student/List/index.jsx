import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { allStudent, deleteStudent } from 'store/reducer/studentReducer'
import moment from 'moment'
import { TableWrapper } from '../studentStyle'
import { useQuery, useHttp } from 'hooks'
import { PaginationWrapper } from 'styled'
import Pagination from 'components/Pagination'
import Box from 'components/Box'
import SearchBar from './SearchBar'
import { useHistory } from 'react-router-dom'
import MoreOption from 'components/MoreOption'
import { BsDownload } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { warning } from 'helpers/alert'

export const Index = ({ match, student, studentData, totalDocs }) => {
  const dispatch = useDispatch()
  const query = useQuery()
  const queries = query.toString()
  const http = useHttp()
  const [selectedDocs, setSelectedDocs] = React.useState([])
  const [downloading, setDownloading] = React.useState(false);

  const onDownloadStudent = async () => {
    setDownloading(true);
    const { data } = await http.post('/api/student/downloads', { studentIds: selectedDocs });
    const a = document.createElement('a');
    a.href = data;
    a.setAttribute('download', '');
    a.click();
    setDownloading(false);
    setSelectedDocs([]);
  }

  const onCheckAll = React.useCallback((e) => {
    if (e.target.type === 'checkbox' && e.target.checked) {
      setSelectedDocs(studentData.docs ? studentData.docs.map(doc => doc._id) : [])
    } else {
      setSelectedDocs([])
    }
  }, [studentData.docs])

  const onCheckEach = React.useCallback((e) => {
    if (e.target.type === 'checkbox' && e.target.checked) {
      setSelectedDocs(selectedDocs => [...selectedDocs, e.target.value])
    } else {
      setSelectedDocs(selectedDocs => [...selectedDocs].filter(item => item !== e.target.value))
    }
  }, [])

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
        title={(
          <button 
            className="btn btn-light" 
            type="button"
            disabled={downloading || selectedDocs.length === 0}
            onClick={onDownloadStudent}
          ><BsDownload /> {downloading ? 'Downloading...' : 'Download'}</button>
        )} 
        hasBackBtn={false}
        maxWidth="100%"
        rightHeader={(
          <Link className="btn btn-primary" to={`${match.url}/create/1`}>Create Student</Link>
        )}
      >
        <div className="py-3">
          <ListWrapper 
            isFetching={student && student.isFetching} 
            onCheckAll={onCheckAll}
            isCheckedAll={selectedDocs.length === totalDocs}
          >
            {studentData && studentData.docs && studentData.docs.map((doc, key) => (
              <Lists 
                key={key} 
                doc={doc} 
                match={match}
                onCheck={onCheckEach}
                checkValue={doc._id}
                checked={selectedDocs.includes(doc._id)}
              />
            ))}
            {totalDocs === 0 && (
              <tr>
                <td colSpan="8" className="text-center">No Records Found.</td>
              </tr>
            )}
          </ListWrapper>
          
          {studentData && studentData.totalDocs > studentData.limit && (
            <PaginationWrapper>
              <Pagination 
                totalPages={studentData && studentData.totalPages}
                current={studentData && studentData.page}
              />
            </PaginationWrapper>
          )}
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

const ListWrapper = ({ isFetching, children, onCheckAll, isCheckedAll }) => (
  <TableWrapper>
    <table className="table mb-0">
      <tbody>
        <tr>
          <th>
            <input 
              type="checkbox" 
              style={{ width: '20px', height: '20px', }} 
              onChange={onCheckAll}
              checked={isCheckedAll}
            />
          </th>
          <th>Name</th>
          <th>Payment Plan</th>
          <th>Contract Signed</th>
          <th>Sales Rep</th>
          <th>Status</th>
          <th>Joined Date</th>
          <th>Action</th>
        </tr>
        {isFetching ? (
          <tr><td colSpan="8" className="text-center">Loading...</td></tr>
        ) : children}
      </tbody>
    </table>
  </TableWrapper>
)

const Lists = ({ doc, match, onCheck, checkValue, checked }) => {
  const history = useHistory()
  const http = useHttp();
  const [downloading, setDownloading] = React.useState(false);
  const dispatch = useDispatch();

  const onDownloadStudent = async (studentId) => {
    setDownloading(true);
    const { data } = await http.post('/api/student/download', { studentId });
    setDownloading(false);
    const a = document.createElement('a');
    a.href = data;
    a.setAttribute('download', '');
    a.click();
  }

  const onDeleteStudent = async (studentId, index) => {
    const deleteWarn = await warning({ title: 'Are you sure?' });
    if (deleteWarn) {
      const { data } = await http.delete('/api/student/delete/' + studentId);
      if (data.success) {
        dispatch( deleteStudent({ index }) );
        toast.success('Successfully deleted.');
      }
    }
  }

  return (
    <tr>
      <td>
        <input 
          type="checkbox" 
          style={{ width: '20px', height: '20px', }} 
          value={checkValue}
          onChange={onCheck}
          checked={checked}
        />
      </td>
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
        <MoreOption>
          <Link to={`${match.url}/${doc._id}`}>View</Link>
          <a href={'/student-pdf/' + doc._id} target="_blank">View Pdf</a>
          <button 
            disabled={downloading} 
            type="button" 
            onClick={() => onDownloadStudent(doc._id)}
          >
            {downloading ? 'Downloading...' : 'Download'}
          </button>
          <button 
            type="button"
            onClick={() => onDeleteStudent(doc._id)}
            >Delete</button>
        </MoreOption>
      </td>
    </tr>
  )
}
