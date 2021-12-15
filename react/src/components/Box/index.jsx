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
  hasBackBtn = true }) {

  const history = useHistory()
  
  return (
    <style.BoxWrapper hasShadow={hasShadow} maxWidth={maxWidth}>
      <style.BoxHeader>
        <div>
          {hasBackBtn && <style.BackButton className="btn" onClick={() => backPath ? history.push(backPath) : history.goBack()}>
            <MdKeyboardBackspace />
          </style.BackButton>}
          <style.Title titleSize={titleSize}>{title}</style.Title>
        </div>
        {rightHeader && <div>{rightHeader}</div>}
      </style.BoxHeader>
      <style.BoxBody>
        {children}
      </style.BoxBody>
    </style.BoxWrapper>
  )
}

