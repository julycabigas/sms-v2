import { useHttp } from 'hooks';
import React, { useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import AddNote from './AddNote';
import { allNote } from 'store/reducer/noteReducer';
import { useDispatch, useSelector } from 'react-redux';
import { TableWrapper, PaginationWrapper } from 'styled';
import MoreOption from 'components/MoreOption';

const Notes = ({ match, studentId }) => {
  const http = useHttp();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await http.get('/api/notes/' + studentId);
      dispatch( allNote(data) );
    })()
  }, [dispatch, studentId]);

  return (
    <div className="pt-4 pb-4">
      <Switch>
        <Route exact path={`${match.url}/add`}>
          <AddNote studentId={studentId} />
        </Route>
        <Route exact path={`${match.url}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Notes</h5>
            <Link class="btn btn-primary btn-sm" to={`${match.url}/add`}>Add Note</Link>
          </div>
          <List />
        </Route>
      </Switch>
    </div>
  );
}

const List = () => {
  const { noteDocs } = useSelector(state => state.note);

  return (
    <TableWrapper>
      <table className="table mb-0 border">
        <tbody>
          <tr>
            <th>Message</th>
            <th className='text-right'>Actions</th>
          </tr>
          {noteDocs && noteDocs.docs && noteDocs.docs.map((item, key) => (
            <tr key={key}>
              <td>
                <div 
                  className="d-flex" 
                  dangerouslySetInnerHTML={{ __html: item.note }} 
                />
              </td>
              <td className="d-flex justify-content-end">
                <MoreOption>
                  <a>Edit</a>
                  <button type="button">Delete</button>
                </MoreOption>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  )
}

export default Notes;
