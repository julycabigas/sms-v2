import styled from 'styled-components'

export const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Form = styled.form`
  background: #fff;
  padding: 0 30px;
  width: 100%;
  max-width: 600px;
  border-radius: 4px;
`;

export const BackButton = styled.button`
  border-radius: 50%;
  font-size: 1.2em;
  font-weight: 600;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover {
    background: #f5f5f5;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-left: -10px;
  padding: 13px 0;
  border-bottom: 1px solid #ced4da;
`;

export const TableWrapper = styled.div`
  border-radius: 3px;
  overflow: hidden;
  tbody tr:first-child th {
    border-top: none !important;
  }
  th, td {
    vertical-align: middle;
  }
  tr:hover td {
    background: var(--table-hover-bg);
  }
  td:not(:last-child) {
    cursor: pointer;
  }
`;