import styled from 'styled-components';

export const PaidBox = styled.div`
  background-color: var(--box-bg);
  max-width: 335px;
  padding: 20px;
  box-shadow: 0px 0px 40px #00000012;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 172px;
  .upper--paid-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 2px;
    .total {
      font-size: 2em;
      font-weight: bold;
    }
  }
  .lower--paid-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    .total-name {
      font-size: 1.06em;
      opacity: 0.7;
    }
  }
`;
