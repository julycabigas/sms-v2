import React, { useState } from 'react';
import Box from 'components/Box';
import { TableWrapper, PaginationWrapper } from 'styled';
import { FaPlus } from 'react-icons/fa';
import { useHttp, useQuery } from 'hooks';
import { useDispatch, connect } from 'react-redux';
import { allUserDocs, deleteUser } from 'store/reducer/userReducer'
import styled from 'styled-components';
import MoreOption from 'components/MoreOption';
import Create from '../Create';
import Edit from '../Edit';
import Pagination from 'components/Pagination';
import { toast } from 'react-toastify';  
import { warning } from 'helpers/alert';

function Index({ user }) {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const http = useHttp();
  const dispatch = useDispatch();
  const query = useQuery()
  const queries = query.toString()

  const openModalEdit = (userId) => {
    setEditModalShow(true);
    setEditUserId(userId);
  }

  const onDeleteUser = async (userId) => {
    const deleteWarn = await warning({ title: 'Are you sure' });
    if (deleteWarn.isConfirmed) {
      const { data } = await http.delete('/api/user/' + userId);
      if (data.success) {
        dispatch( deleteUser({ userId }) );
        toast.success('Successfully deleted.');
      }
    }
  }

  React.useEffect(() => {
    (async () => {
      const { data } = await http.get('/api/user' + '?' + queries);
      dispatch( allUserDocs(data) );
    })();
  }, [dispatch, queries]);

  return (
    <>
      {createModalShow && (
        <Create 
          modalShow={createModalShow} 
          onModalClose={() => setCreateModalShow(false)}
        />
      )}
      {editModalShow && (
        <Edit 
          userId={editUserId}
          modalShow={editModalShow} 
          onModalClose={() => {
            setEditModalShow(false);
            setEditUserId(null);
          }}
        />
      )}
      <Box 
        hasBackBtn={false} 
        title="Users" 
        maxWidth="100%"
        rightHeader={(
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            <FaPlus /> <span className="ml-2">Add new</span>
          </button>
        )}
      >
        <TableWrapper>
          <table className="table mb-0">
            <tbody>
              <tr>
                <th>Photo</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Action</th>
              </tr>
              {user && user.docs ? user.docs.map((item, key) => (
                <List 
                  key={key} 
                  item={item} 
                  openModalEdit={() => openModalEdit(item._id)}
                  onDeleteUser={() => onDeleteUser(item._id)}
                />
              )) : (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              )}
              {user && user.docs.length === 0 &&  (
                <tr><td colSpan="6" className="text-center">No Records found.</td></tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
      </Box>
      {user && user.totalDocs > user.limit && (
        <PaginationWrapper>
          <Pagination 
            totalPages={user && user.totalPages}
            current={user && user.page}
          />
        </PaginationWrapper>
      )}
    </>
  );
}
 
const List = ({ item, openModalEdit, onDeleteUser }) => (
  <tr>
    <td>
      {item.photo && <ImageProfile src={item.photo} />}
    </td>
    <td>{item.first_name}</td>
    <td>{item.last_name}</td>
    <td>{item.email}</td>
    <td>{item.contact_number}</td>
    <td>
      <MoreOption>
      <button type="button" onClick={openModalEdit}>Edit</button>
      {/* <button type="button" onClick={onDeleteUser}>Delete</button> */}
      </MoreOption>
    </td>
  </tr>
)

const ImageProfile = styled.img`
  width: 60px;
  border-radius: 50%;
  height: 60px;
`;

const mapStateToProps = (state) => ({
  user: state.user.userDocs,
});

export default connect(mapStateToProps)(Index);

