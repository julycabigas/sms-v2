import moment from 'moment';
import React from 'react';
import { useHttp, useAuth } from 'hooks';

const ActivityLogByRef = ({ refId }) => {
  const http = useHttp();
  const [log, setLog] = React.useState(null);
  const { user } = useAuth();

  React.useEffect(() => {
    (async () => {
      const { data } = await http.get('/api/logs/' + refId);
      if (data && Array.isArray(data)) {
        setLog(data[0]);
      }
    })(); 
  }, [refId]);

  return (
    <>
    {log && (
      <p className="mb-0">
        <strong>{log.type && log.type.message} </strong> <i>by</i> 
        <strong> {log.user && log.user._id === user._id ? 'You' : log.user.name} </strong> <i>at</i> 
        <span> {log.time && moment(log.time).format('MMMM DD, YYYY hh:mm:ss A')}</span>
      </p>
    )}
    </>
  );

}

export default ActivityLogByRef;