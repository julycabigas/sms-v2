import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as P from './planStyle';
import { fetch, deletePan } from 'store/reducer/planReducer'
import Pagination from 'components/Pagination'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'hooks'
import { PaginationWrapper } from 'styled'
import Box from 'components/Box';
import { useHttp } from 'hooks'
import MoreOption from 'components/MoreOption';
import Create from './Create';
import { FaPlus } from 'react-icons/fa';
import Edit from './Edit';
import { TableWrapper as TableWrapperStyle } from 'styled';
import { warning } from 'helpers/alert';
import { toast } from 'react-toastify';

export const Index = ({ plan, isFetching }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const query = useQuery()
  const queries = query.toString()
  const http = useHttp()
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [planId, setPlanId] = useState(null);


  const onPlanEdit = (planId) => {
    setPlanId(planId);
    setOpenEditModal(true);
  }

  const onPlanDelete = async (planId) => {
    const deleteWarn = await warning({ title: 'Are you sure?' });
    if (deleteWarn.isConfirmed) {
      const { data } = await http.delete('/api/plan/' + planId);
      if (data.success) {
        dispatch( deletePan({ planId }) );
        toast.success("Successfully deleted");
      }
    }
  }

  useEffect(() => {
    (async () => {
      dispatch( fetch({ isFetching: true }) )
      const res = await http.get(`/api/plan${queries ? `?${queries}` : ''}`)
      dispatch(fetch({ isFetching: false, plan: res.data }))
    })()
  }, [dispatch, queries])

  return (
    <>
      {openEditModal && (
        <Edit 
          onModalClose={() => {
            setPlanId(null);
            setOpenEditModal(false);
          }} 
          modalShow={openEditModal} 
          planId={planId}
        />
      )}
      {openCreateModal && (
        <Create 
          onModalClose={() => setOpenCreateModal(false)} 
          modalShow={openCreateModal} 
        />
      )}
      <>
        <Box 
          hasBackBtn={false} 
          title="Plans" 
          maxWidth="100%"
          rightHeader={(
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setOpenCreateModal(true)}
            >
              <FaPlus /> <span className="ml-2">Add new</span>
            </button>
          )}
        >
          <TableWrapperStyle>
            <TableWrapper>
              {plan && plan.docs && plan.docs.map((doc, key) => (
                <List 
                  key={key} 
                  doc={doc}
                  onEdit={() => onPlanEdit(doc._id)}
                  onDelete={() => onPlanDelete(doc._id)}
                />
              ))}
              {plan && plan.totalDocs === 0 && (
                <Waiting message="No Records Found." />
              )}
              {isFetching && (
                <Waiting message="Loading..." />
              )}
            </TableWrapper>
          </TableWrapperStyle>
        </Box>
        <Links plan={plan} location={location} />
      </>
    </>
  );
}

const mapStateToProps = (state) => ({
  plan: state.plan.planDocs,
  isFetching: state.plan.isFetching,
});

export default connect(mapStateToProps)(Index);

const Waiting = ({ message }) => (
  <tr>
    <td colSpan="4" className="text-center">{message}</td>
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
  <P.Table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Quantity</th>
        <th>Currency</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </P.Table>
)

const List = ({ doc, onEdit, onDelete }) => (
  <tr>
    <td>{doc.resultName}</td>
    <td>{doc.quantity}</td>
    <td>{doc.currency}</td>
    <td>
      <MoreOption  minWidth="150px">
        <a
          onClick={onEdit} 
        >Edit</a>
        <button type="button" onClick={onDelete}>Delete</button>
      </MoreOption>
    </td>
  </tr>
)
