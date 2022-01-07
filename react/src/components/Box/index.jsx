import React from 'react'
import { MdKeyboardBackspace } from "react-icons/md";
import * as style from './styled'
import { useHistory } from 'react-router-dom'

export default function Box({ 
  rightHeader, 
  hasShadow = false, 
  maxWidth, 
  title, 
  backPath, 
  titleSize, 
  children, 
  hasBackBtn = true,
  hasHeader = true
}) {

  const history = useHistory()
  
  return (
    <style.BoxWrapper hasShadow={hasShadow} maxWidth={maxWidth}>
      {hasHeader && (
        <style.BoxHeader>
          <div>
            {hasBackBtn && <style.BackButton className="btn" onClick={() => backPath ? history.push(backPath) : history.goBack()}>
              <MdKeyboardBackspace />
            </style.BackButton>}
            <style.Title titleSize={titleSize}>{title}</style.Title>
          </div>
          {rightHeader && <div>{rightHeader}</div>}
        </style.BoxHeader>
      )}
      <style.BoxBody>
        {children}
      </style.BoxBody>
    </style.BoxWrapper>
  )
}

Box.Footer = ({ children }) => (
  <style.BoxFooter>
    {children}
  </style.BoxFooter>
)

