import styled from 'styled-components';

const _height = '70px';

export const Header = styled.header`
  height: ${_height};
  background: var(--box-bg);
  box-shadow: -1px 0px 20px #00000026;
`;

export const Nav = styled.nav`
  height: ${_height};
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    padding: 8px 15px;
    margin-right: 3px;
    color: var(--link-color-nav);
    opacity: 0.9;
    font-weight: 600;
    border-radius: 0.50em; 
    text-decoration: none;
    &:hover,
    &.active {
      background: var(--link-hover-bg);
      text-decoration: none;
      opacity: 1;
    }
  }
`;

export const Logo = styled.div`
  font-size: 1.5em;
  font-weight: 900;
`;