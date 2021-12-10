import React from 'react';
import ReactDom from 'react-dom';
import { ModalOverlay, ModalContainer, ModalContent, ModalHeader, ModalBody, ModalFooter } from './modal.style';
import { GrClose } from 'react-icons/gr';
import { CSSTransition } from 'react-transition-group'; 

const modalRoot = document.getElementById('modal-root');
const el = document.createElement('div');
const body = document.body;

function Modal({ show, children, onClose, title, width }) {
  const modalContentRef = React.useRef(null);

  React.useEffect(() => {
    const windowClick = (e) => {
      if ((modalContentRef && modalContentRef.current) && 
        !(e.target === modalContentRef.current || modalContentRef.current.contains(e.target))
      ) {
        onClose();
      }
    }
    window.addEventListener('click', windowClick);
    return () => window.removeEventListener('click', windowClick);
  }, [show]);

  React.useEffect(() => {
    if (show) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  }, [show]);

  return (
    <ModalRoot>
      <CSSTransition
        in={show}
        timeout={300}
        unmountOnExit
        classNames="modal"
        onEnter={() => {}}
        onExited={onClose}
      >
        <ModalOverlay>
          <ModalContainer>
            <ModalContent width={width} ref={modalContentRef} className="app-modal-container">
              <Header 
                onClose={onClose} 
                title={title} 
              />
              {children}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      </CSSTransition>
    </ModalRoot>
  )
}

const Header = ({ title, onClose }) => {  
  return (
    <ModalHeader>
      <span className="title">{title}</span>
      <span className="close-btn" onClick={onClose}>
        <GrClose />
      </span>
    </ModalHeader>
  )
}

Modal.Body = ({ children }) => {
  return (
    <ModalBody>{children}</ModalBody>
  )
}

Modal.Footer = ({ children }) => {
  return (
    <ModalFooter>{children}</ModalFooter>
  )
}

function ModalRoot({ children }) {
  React.useEffect(() => {
    modalRoot.appendChild(el);
    return () => modalRoot.removeChild(el);
  }, []);
  return ReactDom.createPortal(children, el);
}

export default Modal;