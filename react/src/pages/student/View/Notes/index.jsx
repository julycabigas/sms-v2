import { useAuth, useHttp, useQuery } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import AddNote from './AddNote';
import EditNote from './EditNote';
import { allNote } from 'store/reducer/noteReducer';
import { useDispatch, useSelector } from 'react-redux';
import { TableWrapper, PaginationWrapper } from 'styled';
import MoreOption from 'components/MoreOption';
import Modal from 'components/Modal';
import Pagination from 'components/Pagination';
import { warning } from 'helpers/alert';
import { toast } from 'react-toastify';
import { deleteNote } from 'store/reducer/noteReducer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const Notes = ({ match, studentId }) => {
  const http = useHttp();
  const dispatch = useDispatch();
  const query = useQuery();

  const queries = query.toString();

  useEffect(() => {

    (async () => {
      const { data } = await http.get(`/api/notes/${studentId}?${queries}`);
      dispatch( allNote(data) );
    })()
  }, [dispatch, studentId, queries]);

  return (
    <div className="pt-4 pb-4">
      <Switch>
        <Route exact path={`${match.url}/add`}>
          <AddNote studentId={studentId} />
        </Route>
        <Route exact path={`${match.url}/:id/edit`}>
          <EditNote />
        </Route>
        <Route exact path={`${match.url}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Notes</h5>
            <Link className="btn btn-primary btn-sm" to={`${match.url}/add`}>Add Note</Link>
          </div>
          <List match={match}/>
        </Route>
      </Switch>
    </div>
  );
}

const List = ({match}) => {
  const { noteDocs } = useSelector(state => state.note);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [noteModalContent, setNoteModalContent] = useState(null);
  const { user } = useAuth();
  const http = useHttp();
  const dispatch = useDispatch();

  const onDeleteNote = async (noteId, index) => {
    const deleteWarn = await warning({ title: 'Are you sure?' });
    if (deleteWarn.isConfirmed) {
      const { data } = await http.delete('/api/notes/' + noteId);
      if (data.success) {
        dispatch( deleteNote({ index }) );
        toast.success('Successfully deleted!');
      }
    }
  }

  const noteHTMLtoText = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html; 
    const text = d.innerText;
    if (text.length > 80) {
      return text.split('').slice(0, 80).join('') + '...';
    } else {
      return text;
    }
  }

  return (
    <>
      <Modal 
        show={openNoteModal}
        onClose={() => {
          setOpenNoteModal(false);
          setNoteModalContent(null);
        }}
        title="Note"
        width="800px"
      >
        <Modal.Body>
          {noteModalContent && (
              <div 
                className='p-2'
                style={{ 
                  minHeight: '200px', 
                  maxHeight: '80vh', 
                  overflow: 'auto' 
                }}
                dangerouslySetInnerHTML={{ __html: noteModalContent }} 
              />
            )}
        </Modal.Body>
      </Modal>
      
      
      <TableWrapper>
        <table className="table mb-0 border">
          <tbody>
            <tr>
              <td style={{ opacity: 0.6 }}>Message</td>
              <td style={{ opacity: 0.6 }}>Creator</td>
              <td style={{ opacity: 0.6 }} className='text-right'>Actions</td>
            </tr>
            {noteDocs && noteDocs.docs ? noteDocs.docs.length === 0 && (
              <tr>
                <td colSpan="3" className='text-center'>No Records Found.</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="3" className='text-center'>Loading...</td>
              </tr>
            )}
            {noteDocs && noteDocs.docs && noteDocs.docs.map((item, key) => (
              <tr key={key}>
                <td onClick={() => {
                  setOpenNoteModal(true);
                  setNoteModalContent(item.note);
                }}>
                  {noteHTMLtoText(item.note)}
                </td>
                <td>
                  {item.creator && (
                    user && (
                      user._id === item.creator._id ? 'You' : item.creator.name
                    )
                  )}
                </td>
                <td className="d-flex justify-content-end">
                  <MoreOption>
                    <button type="button" onClick={() => onDeleteNote(item._id, key)}>Delete</button>
                    <Link className="" to={`${match.url}/${item._id}/edit`}>Edit</Link>
                  </MoreOption>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {noteDocs && noteDocs.totalDocs > noteDocs.limit && (
          <PaginationWrapper>
            <Pagination 
              totalPages={noteDocs.totalPages}
              current={noteDocs.page}
            />
          </PaginationWrapper>
        )}
      </TableWrapper>
    </>
  )
}

export default Notes;
