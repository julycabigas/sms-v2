import React from 'react';
import ReactDom from 'react-dom';

const modalRoot = document.getElementById('modal-root');
const el = document.createElement('div');

function ModalRoot({ children }) {

  React.useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    }
  }, []);

  return ReactDom.createPortal(children, el);
}

function Modal({ show, children, onClose }) {
  
  if (!show) return <></>;

  return (
    <ModalRoot>
      <div className="modal-overlay">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </ModalRoot>
  )
}

Modal.Header = () => {
  return (
    <div></div>
  )
}

Modal.Body = () => {
  return (
    <div></div>
  )
}

Modal.Footer = () => {
  return (
    <div></div>
  )
}

export default Modal;