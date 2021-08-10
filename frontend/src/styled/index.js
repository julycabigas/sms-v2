import styled from 'styled-components';

export const PaginationWrapper = styled.div`
  background: var(var(--box-bg));
  padding: 10px 0;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  .pagination {
    margin-bottom: 0;
    .page-link {
      font-weight: 500;
      color: var(--text-color);
      border: 1px solid transparent;
      border-radius: 7px;
      margin: 0 1px;
      background: transparent;
      &:hover {
        background: var(--link-hover-bg);
        color: var(--link-color-nav);
        opacity: 0.7;
      }
      &.active {
        background: var(--link-hover-bg);
        color: var(--link-color-nav);
      }
    }
  }
`;