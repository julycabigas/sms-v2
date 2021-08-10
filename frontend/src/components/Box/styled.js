import styled from 'styled-components'

export const Title = styled.div`
  font-size: ${props => props.titleSize || '1.3em'};
  font-weight: 600;
`

export const BackButton = styled.button`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
  margin-right: 15px;
  font-size: 1.2em;
  background: var(--back-btn-bg);
  &:hover {
    opacity: 0.8;
  }
`

export const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 15px;
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
  }
`

export const BoxBody = styled.div`
  padding: 0 15px;
`

export const BoxWrapper = styled.div`
  width: 100%;
  background: var(--box-bg);
  max-width: ${props => props.maxWidth || '1300px'};
  border-radius: 7px;
  box-shadow: ${props => props.hasShadow && '0 2px 14px #00000012'};
`