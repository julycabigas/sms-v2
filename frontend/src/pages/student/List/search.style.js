import styled from 'styled-components'

const width = '500px'

export const SearchWrapper = styled.form`
	position: relative;
	margin-bottom: 15px;
  z-index: 1;
	.filter-input {
	 	border-radius: 7px;
	  background: var(--box-bg);
    display: flex;
    align-items: center;
    max-width: 280px;
    height: 40px;
    padding: 10px 15px;
    cursor: pointer;
    color: var(--text-color);
	}
	&:focus-within > .filter-input + div {
		/* visibility: visible; */
	}
`

export const SearchIncludes = styled.div`
	position: absolute;
    padding: 26px;
    width: 100%;
    max-width: ${width};
    background: var(--box-bg);
    border-radius: 7px;
    border-top: 0;
    /* visibility: hidden; */
    box-shadow: 0px 3px 6px #0000001f;
    margin-top: 5px;
`

export const DividerQuery = styled.div`
  margin: 0 10px;
  height: 20px;
  width: 1px;
  background: #60676d;
`;

export const Query = styled.div`
  background-color: var(--box-bg);
  margin-right: 7px;
  padding: 6px;
  padding-left: 12px;
  border-radius: 30px;
  .text {
    margin-right: 8px;
    font-size: 0.8em;
  }
  button {
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 50%;
    font-size: 14px;
    background: transparent;
    &:hover {
      background: var(--bg);
    }
  }
`;