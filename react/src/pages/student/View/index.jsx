import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { useParams, Switch, HashRouter, Route, NavLink, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Box from 'components/Box'
import * as style from './index.style'
import { useHttp } from 'hooks'
import { getDetails } from 'store/reducer/studentDetails'
import { allDeposit } from 'store/reducer/depositReducer'
import { BsDownload } from 'react-icons/bs';
import { GoFilePdf } from 'react-icons/go';
import ActivityLogByRef from 'components/ActivityLogByRef';


const Deposit = React.lazy(() => import('./Deposit'));
const PaymentLists = React.lazy(() => import('./PaymentLists'));
const Edit = React.lazy(() => import('./Edit'));
const Home = React.lazy(() => import('./Home'));
const TotalPaid = React.lazy(() => import('./TotalPaid'));
const Notes = React.lazy(() => import('./Notes'));

export const Index = ({ match }) => {
  const { studentId } = useParams()
  const dispatch = useDispatch()
  const http = useHttp()
  const [downloading, setDownloading] = React.useState(false)

  const onDownloadStudent = async () => {
    setDownloading(true);
    const { data } = await http.post('/api/student/download', { studentId });
    setDownloading(false);
    const a = document.createElement('a');
    a.href = data;
    a.setAttribute('download', '');
    a.click();
  }

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        dispatch( getDetails({ isFetching: true }) )
        const { data } = await http.get(`/api/student/${studentId}`)
        if (unmount) {
          dispatch( getDetails({ studentDetails: data, isFetching: false }) )
        }
      })()
    }
    return () => unmount = false
  }, [studentId, dispatch])

  React.useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get(`/api/student/${studentId}/deposit`)
        if (unmount) {
          dispatch( allDeposit(data) )
        }
      })()
    }
    return () => unmount = false
  }, [studentId, dispatch])

  return (
    <MainWrapper>
      <Box 
        title="Details" 
        backPath="/student"
        maxWidth="100%"
        rightHeader={(
          <>
            <button type="button" className="btn btn-light mr-2"
              onClick={onDownloadStudent}  
              disabled={downloading}
            >
              <BsDownload/> {downloading ? 'Downloading...' : 'Download Pdf'}
            </button>
            <a href={'/student-pdf/' + studentId} target="_blank" className="btn btn-light">
              <GoFilePdf /> View Pdf
            </a>
          </>
        )}  
      >
        <HashRouter basename="/">
          <div className="row">
            <div className="col-md-2 pl-0">
              <style.LinkWrapper className="border-right p-3">
                <NavLink to="/home">Student Info</NavLink>
                <NavLink to="/total-paid">Total Paid</NavLink>
                <NavLink to="/payment-lists">Payment Lists</NavLink>
                <NavLink to="/deposits">Deposits</NavLink>
                <NavLink to="/notes">Notes</NavLink>
              </style.LinkWrapper>
            </div>
            <div className="col-md-10" style={{ minHeight: '400px' }}>
              <React.Suspense fallback={<p></p>}>
                <Switch>
                  <Route path={`/payment-lists`} component={PaymentLists} />
                  <Route path={`/notes`} render={(props) => <Notes {...props} studentId={studentId} />} />
                  <Route path={`/deposits`} component={Deposit} />
                  <Route exact path={`/edit`} component={Edit} />
                  <Route exact path={`/total-paid`} render={props => <TotalPaid {...props} studentId={studentId} />} />
                  <Route exact path={`/home`} component={Home} />
                  <Redirect from="/" to="/home" />
                </Switch>
              </React.Suspense>
            </div>
          </div>
        </HashRouter>
        <div className="border-top p-3">
          <ActivityLogByRef refId={studentId} />
        </div>
      </Box>
    </MainWrapper>
  )
}

const mapStateToProps = (state) => ({})
export default connect(mapStateToProps)(Index)


const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
