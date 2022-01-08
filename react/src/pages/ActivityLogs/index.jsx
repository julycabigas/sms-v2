import React, { useEffect, useState } from 'react'
import Box from 'components/Box'
import { TableWrapper, PaginationWrapper } from 'styled';
import { useAuth, useHttp, useQuery } from 'hooks';
import Pagination from 'components/Pagination'
import moment from 'moment'

const ActivityLogs = () => {
  const [logData, setLogData] = useState(null);
  const http = useHttp();
  const query = useQuery();
  const { user } = useAuth();

  const queries = query.toString();

  useEffect(() => {
    (async () => {
      const { data }  = await http.get('/api/logs?' + queries);
      setLogData(data);
    })(); 
  }, [queries]);

  return (
    <>
      <Box 
        title="Activity Logs"
        maxWidth="100%"
        hasBackBtn={false}
      >
        <div className="py-3">
          <TableWrapper className="table-responsive">
          <table className="table mb-0">
            <tbody>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Type</th>
                <th>Message</th>
                <th>Ref</th>
              </tr>
              {logData && logData.docs && logData.docs.map((doc, key) => (
                <tr key={key}>
                  <td>{doc.time && moment(doc.time).format('MMM DD, YYYY hh:mm:ss A')}</td>
                  <td>
                    {user && user._id === doc.user._id ? 'You' : doc.user.name }
                  </td>
                  <td>{doc.type && doc.type.type}</td>
                  <td>{doc.type && doc.type.message}</td>
                  <td>{doc.reference && doc.reference.collectionName}</td>
                </tr>
              ))}
              {!logData && (
                <tr>
                  <td colSpan={5} className="text-center">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
        </div> 
      </Box>
      <Links logData={logData} />
    </>
  );
}

const Links = ({ logData }) => (
  <>
    {logData && logData.totalDocs > logData.limit && (
      <PaginationWrapper className="mb-3">
        <Pagination 
          totalPages={logData && logData.totalPages}
          current={logData && logData.page}
        />
      </PaginationWrapper>
    )}
  </>
)

export default ActivityLogs;