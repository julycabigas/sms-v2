import React, { useState, useEffect } from 'react';
import Box from 'components/Box';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useHttp } from 'hooks';
import { useDispatch } from 'react-redux';
import { updateNote } from 'store/reducer/noteReducer';
import { toast } from 'react-toastify';
import { useHistory, useParams} from 'react-router-dom';

const EditNote = () => {
  const noteId = useParams().id
  const [note, setNote] = useState(null)
  const http = useHttp();
  const dispatch = useDispatch();
  const history = useHistory();
  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await http.get(`/api/notes/${noteId}/details`);
      setNote(data)
    })();
  }, []);

  const updateHandler = async () => {
    setDisabledBtn(true);  
    const { data } = await http.put(`/api/notes/${note._id}`, {note});
    if (data.success) {
      toast.success('Note Successfully updated.');
      dispatch( updateNote(data.note) );
      setTimeout(() => {
        setDisabledBtn(false);
      }, 300);
    } else {
      toast.error('Something went wrong, please try again later.');
      setTimeout(() => {
        setDisabledBtn(false);
      }, 300);
    }
  }
  
  return (
    <div className="mt-3">
      <Box 
        hasShadow={true} 
        maxWidth="100%" 
        title="Edit Notes" 
        titleSize="1.1em"
        rightHeader={(
          <button className="btn btn-primary" type="button" onClick={updateHandler}
            disabled={disabledBtn}
          >
            Update
          </button>
        )}
      >
        {note ? (
          <div className="note-quill py-3">
            <ReactQuill 
              theme="snow" 
              placeholder="Enter notes here..." 
              value={note.note}
              onChange={(value) => note.note = value}
            />
          </div>
        ) : (
          <span>Loading..</span>
        )}
      </Box>
    </div>
  );
}

export default EditNote;
