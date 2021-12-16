import styled from 'styled-components'

export const ImageProfile = styled.img`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  cursor: pointer;
`;

export const ProfileInner = styled.div`
  background: var(--box-bg);
  top: 43px;
  right: 0;
  border-radius: 4px;
  width: 255px;
  position: absolute;
  box-shadow: -1px 0px 20px #00000026;
`;

export const ProfileLinkWrapper = styled.div`
  a, button {
    padding: 8px 11px !important;
    margin-right: 0 !important;
    border-radius: 0 !important;
    padding: 14px 15px;
    opacity: 0.9;
    font-weight: 600;
    border-radius: 4px;
    text-decoration: none;
    text-align: left;
    background: transparent;
    border: 0;
  }
  button:hover {
    background: var(--link-hover-bg);
  }
`;

export const TogglerButton = styled.button`
  border: 0;
  background: transparent;
  height: 40px;
  width: 40px;
  margin-right: 10px;
  font-size: 26px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
`