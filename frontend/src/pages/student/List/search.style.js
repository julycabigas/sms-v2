import styled from 'styled-components'

const width = '500px'

export const SearchWrapper = styled.form`
	position: relative;
	margin-bottom: 15px;
	.filter-input {
		max-width: ${width};
	 	border-radius: 7px;
	  border: 1px solid var(--border-color);
	  background: var(--box-bg);
    display: flex;
    align-items: center;
    max-width: 280px;
    height: 40px;
		box-shadow: 0px 3px 6px #0000001f;
    border: 0;
    padding: 10px;
    cursor: pointer;
	}
	&:focus-within > .filter-input + div {
		visibility: visible;
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
    visibility: hidden;
    box-shadow: 0px 3px 6px #0000001f;
    margin-top: 5px;
    input, select {
		margin-bottom: 10px;
	}
`