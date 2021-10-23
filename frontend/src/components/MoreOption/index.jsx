import React from 'react'
import { MoreOptionWrapper, MoreOptionInner, ButtonToggler } from './style';
import { GrMoreVertical } from 'react-icons/gr';

export default function MoreOption({ children }) {
  return (
    <MoreOptionWrapper tabIndex="0">
      <ButtonToggler focus={true}>
        <GrMoreVertical />
      </ButtonToggler>
      <MoreOptionInner className="inner">
        {children}
      </MoreOptionInner>
    </MoreOptionWrapper>
  )
}
