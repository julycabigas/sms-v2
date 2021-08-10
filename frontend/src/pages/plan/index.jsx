import React from 'react';
import { connect, useDispatch } from 'react-redux';
import Create from './Create';
import Edit from './Edit';
import * as P from './planStyle';
import { fetch, setEdit } from 'store/reducer/planReducer'
import Pagination from 'components/Pagination'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'hooks'
import { PaginationWrapper } from 'styled'
import Box from 'components/Box';
import { useHttp } from 'hooks'
import BaseLayout from 'layouts/BaseLayout'

export const Index = ({ plan, isEdit, isFetching, editId }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const query = useQuery()
  const queries = query.toString()
  const http = useHttp()

  React.useEffect(() => {
    (async () => {
      dispatch( fetch({ isFetching: true }) )
      const res = await http.get(`/api/plan${queries ? `?${queries}` : ''}`)
      dispatch(fetch({ isFetching: false, plan: res.data }))
    })()
  }, [dispatch, queries])

  return (
    <BaseLayout>
      <div className="row">
        <div className="col-md-4">
          {isEdit && editId ? <Edit/> : <Create/>}
        </div>

        <div className="col-md-8">
          <Box hasBackBtn={false} title="Plans">
            <TableWrapper>
              {plan && plan.docs && plan.docs.map((doc, key) => (
                <List key={key} doc={doc} dispatch={dispatch} />
              ))}
              {plan && plan.totalDocs === 0 && (
                <Waiting message="No Records Found." />
              )}
              {isFetching && (
                <Waiting message="Loading..." />
              )}
            </TableWrapper>
            <Links plan={plan} location={location} />
          </Box>
        </div>
      </div>
    </BaseLayout>
  );
}

const mapStateToProps = (state) => ({
  plan: state.plan.planDocs,
  isFetching: state.plan.isFetching,
  error: state.plan.error,
  isEdit: state.plan.isEdit,
  editId: state.plan.editId,
});

export default connect(mapStateToProps)(Index);

const Waiting = ({ message }) => (
  <tr>
    <td colSpan="3" className="text-center">{message}</td>
  </tr>
)

const Links = ({ plan, location }) => (
  <>
    {plan && plan.totalDocs > plan.limit && (
      <PaginationWrapper className="mb-3">
        <Pagination 
          prevPage={plan.prevPage}
          nextPage={plan.nextPage}
          path={`${location.pathname}?page`}
          current={plan.page} 
          totalPages={plan.totalPages} />
      </PaginationWrapper>
    )}
  </>
)

const TableWrapper = ({ children }) => (
  <P.Table className="table mb-3 mt-3">
    <thead>
      <tr>
        <th>Name</th>
        <th>Currency</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </P.Table>
)

const List = ({ doc, dispatch }) => (
  <tr>
    <td>{doc.resultName}</td>
    <td>{doc.currency}</td>
    <td>
      <button 
        onClick={() => dispatch( setEdit({ isEdit: true, _id: doc._id }) )} 
        className="btn btn-sm text-primary">Edit</button>
    </td>
  </tr>
)
