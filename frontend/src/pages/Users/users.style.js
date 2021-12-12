import styled from 'styled-components';

export const TableWrapper = styled.div`
  border-radius: 3px;
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