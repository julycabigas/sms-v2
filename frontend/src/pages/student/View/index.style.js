import styled from 'styled-components'

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  height: 100%;
  a {
    margin-bottom: 3px;
    border-radius: 7px;
    padding: 8px 15px;
    color: var(--link-color-nav);
    font-weight: 600;
    &.active {
      background: var(--primary);
      color: #fff;
    }
    &:hover:not(.active) {
      background: var(--link-hover-bg);
    }
  }
`

export const Table = styled.table`
  tr:first-child td {
    border-top: none;
  }
`