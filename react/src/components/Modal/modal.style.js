import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background: #00000066;
  &.modal-enter .app-modal-container {
    opacity: 0;
    transform: scale(0.9);
  }
  &.modal-enter-active .app-modal-container {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms, transform 200ms;
  }
  &.modal-exit .app-modal-container {
    opacity: 1;
  }
  &.modal-exit-active .app-modal-container {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 200ms, transform 200ms;
  }
`;

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
`;

export const ModalContent = styled.div`
  background: var(--box-bg);
  min-width: ${props => props.width || '400px'};
  overflow: auto;
  border-radius: 7px;
  max-height: 100%;
`;

export const ModalHeader = styled.div`
  padding: 13px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid var(--border-color);
  .title {
    font-size: 1.25em;
    font-weight: 500;
  }
  .close-btn {
    position: absolute;
    right: 10px;
    background: #00000017;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.9em;
    &:hover {
      opacity: 0.6;
    }
    svg path {
      stroke: var(--text-color);
    }
  }
`;

export const ModalBody = styled.div`
  padding: ${props => props.padding || '10px'};
`;

export const ModalFooter = styled.div`
  border-top: 1px solid var(--border-color);
  padding: 13px 10px;
`;