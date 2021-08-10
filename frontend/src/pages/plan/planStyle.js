import styled from 'styled-components';

export const FormWrapper = styled.form`
  background: #fff;
  padding: 30px;
`;

export const PlanList = styled.div`
  background: #fff;
`;

export const Table = styled.table`
  margin-bottom: 0;
  thead {
    th {
      border-top-width: 1px;
      border-bottom: 0;
    }
    tr {
      &:first-child {
        th {
          border-top: none;
        }
      }
    }
  }
  tbody {
    tr {
      td {
        font-size: 0.9em;
        font-weight: 500;
      }
    }
  }
`;