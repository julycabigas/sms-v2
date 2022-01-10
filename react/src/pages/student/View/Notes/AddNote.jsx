import React, { useState } from 'react';
import Box from 'components/Box';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useHttp } from 'hooks';
import { useDispatch } from 'react-redux';
import { addNote } from 'store/reducer/noteReducer';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const Addnote = ({ studentId }) => {
  const [note, setNote] = useState(null);
  const http = useHttp();
  const dispatch = useDispatch();
  const history = useHistory();
  const [disabledBtn, setDisabledBtn] = useState(false);

  const onSubmitNote = async () => {
    setDisabledBtn(true);
    const { data } = await http.post('/api/notes/' + studentId, { note });
    if (data.success) {
      toast.success('Note Successfully added.');
      dispatch( addNote(data.note) );
      setTimeout(() => {
        setDisabledBtn(false);
        history.push('/notes');
      }, 300);
    }
  }

  return (
    <div className="mt-3">
      <Box 
        hasShadow={true} 
        maxWidth="100%" 
        title="Add Notes" 
        titleSize="1.1em"
        rightHeader={(
          <button className="btn btn-primary" type="button" onClick={onSubmitNote}
            disabled={disabledBtn}
          >
            Submit
          </button>
        )}
      >
        <div className="note-quill py-3">
          <ReactQuill 
            theme="snow" 
            placeholder="Enter notes here..." 
            value={note}
            onChange={(value) => setNote(value)}
          />
        </div>
      </Box>
    </div>
  );
}

export default Addnote;
