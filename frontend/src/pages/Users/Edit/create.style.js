import styled from 'styled-components';

export const PhotoChooser = styled.label`
  padding: 10px;
  border: 2px ${props => props.image ? 'solid' : 'dashed'} var(--border-color);
  margin-right: ${props => props.image ? '10px' : null};
  width: 120px;
  border-radius: 7px;
  cursor: ${props => props.image ? 'default' : 'pointer'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1em;
  line-height: 1.4;
  height: 112px;
  justify-content: center;
  background-image:${props => props.image ? `url(${props.image})` : null};
  background-size: ${props => props.image ? 'cover' : null};
  &:hover {
    opacity: ${props => props.image ? 1 : 0.8};
  }
  svg {
    margin-bottom: 5px;
    font-size: 26px;
  }
`;

export const PhotoChooserWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  .close-image {
    position: absolute;
    bottom: -12px;
    background: var(--box-bg);
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--border-color);
    border-radius: 50%;
    cursor: pointer;
    svg {
      font-size: 0.9em;
      margin-bottom: 0;
    }
  }
`