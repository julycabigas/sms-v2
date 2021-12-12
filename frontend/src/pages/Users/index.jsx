import React, { useState } from 'react';
import Box from 'components/Box';
import BaseLayout from 'layouts/BaseLayout'
import { TableWrapper } from './users.style';
import { FaPlus } from 'react-icons/fa';
import Create from './Create';

function User() {
  const [createModalShow, setCreateModalShow] = useState(false);

  return (
    <>
      <Create 
        modalShow={createModalShow} 
        onModalClose={() => setCreateModalShow(false)}
      />

      <BaseLayout>
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
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Contact No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </TableWrapper>
        </Box>
      </BaseLayout>
    </>
  );
}

export default User;

