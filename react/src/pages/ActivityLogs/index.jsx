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

  const dateOrText = (text) => {
    const d = moment(text);
    if (d.isValid()) {
      return moment(text).format('YYYY-MM-DD');
    }
    return text;
  }

  const itemKey = (key) => {
    return key.split('_').join(' ');
  }

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
                <th>Activity</th>
                <th>Ref</th>
              </tr>
              {logData && logData.docs && logData.docs.map((doc, key) => (
                <tr key={key}>
                  <td style={{ verticalAlign: 'top' }}>{doc.time && moment(doc.time).format('MMM DD, YYYY hh:mm:ss A')}</td>
                  <td style={{ verticalAlign: 'top' }}>
                    {user && user._id === doc.user._id ? 'You' : doc.user.name }
                  </td>
                  <td>
                    <ul className="pl-3 mb-0">
                    {doc.updates.length ? doc.updates.map((item, key) => (
                      <li key={key}>{item.type || ''} <span style={{ textDecoration: 'underline' }}>{itemKey(item.key)}</span> from {dateOrText(item.from)} to {dateOrText(item.to)}.</li>
                    )) : (
                      <li>{doc.type && doc.type.message}</li>
                    )}
                    </ul>
                  </td>
                  <td style={{ verticalAlign: 'top' }}>{doc.reference && doc.reference.collectionName}</td>
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
      {logData && (
        <PaginationWrapper className="mb-3">
          <Pagination 
            totalPages={logData.totalPages}
            current={logData.page}
          />
        </PaginationWrapper>
      )}
    </>
  );
}
export default ActivityLogs;