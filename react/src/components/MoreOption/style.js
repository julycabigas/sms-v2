import styled from 'styled-components';

const btnWidth = '36px';
const btnHeight = '36px';

export const ButtonToggler = styled.button`
  width: ${btnWidth};
  height: ${btnHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  border: none;
  color: var(--text-color);
  background: var(--bg);
`;

export const MoreOptionWrapper = styled.div`
  position: relative;
  width: ${btnWidth};
  height: ${btnHeight};
  &:focus-within .inner {
    display: flex;
  }
`;

export const MoreOptionInner = styled.div`
  display: none;
  position: absolute;
  background: var(--box-bg);
  min-width: ${props => props.minWidth || '200px'};
  right: 0;
  top: 36px;
  flex-direction: column;
  padding: 10px 0;
  box-shadow: 0px 3px 13px #0000001f;
  border-radius: 7px;
  z-index: 100;
  a, button {
    width: 100%;
    padding: 8px 15px;
    border: 0;
    margin-bottom: 2px;
    font-weight: 600;
    text-align: left;
    color: var(--text-color);
    background: transparent;
  }
  a:hover, button:hover {
    background: var(--table-hover-bg);
  }
`;