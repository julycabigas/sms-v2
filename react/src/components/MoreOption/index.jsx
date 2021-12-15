import React from 'react'
import { MoreOptionWrapper, MoreOptionInner, ButtonToggler } from './style';
import { GrMoreVertical } from 'react-icons/gr';

export default function MoreOption({ children, minWidth }) {
  const [showOption, setShowOption] = React.useState(false);
  const optionsRef = React.useRef(null);

  React.useEffect(() => {
    const windowClick = (e) => {
      if (!showOption) return;
      if ((optionsRef && optionsRef.current) && !(e.target === optionsRef.current || optionsRef.current.contains(e.target))) {
        setShowOption(false);
      }
    }
    window.addEventListener('click', windowClick);
    return () => window.removeEventListener('click', windowClick);
  }, [showOption])

  return (
    <MoreOptionWrapper tabIndex="0">
      <ButtonToggler 
        focus={true} 
        onClick={() => setShowOption(!showOption)}
      >
        <GrMoreVertical />
      </ButtonToggler>
      {showOption && (
        <MoreOptionInner className="inner" ref={optionsRef} minWidth={minWidth}>
          {children}
        </MoreOptionInner>
      )}
    </MoreOptionWrapper>
  )
}
