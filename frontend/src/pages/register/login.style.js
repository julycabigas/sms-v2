import styled from 'styled-components'

export const LoginWrapper = styled.div`
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginContent = styled.div`
  background: var(--box-bg);
  padding: 30px;
  border-radius: 7px;
  width: 100%;
  max-width: 450px;
  h4 {
    color: var(--text-color);
  }
`