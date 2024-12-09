import React from 'react'
import { ExtendedMotionDiv } from './tags/custommotiontags'

import { IconType } from 'react-icons'

function Loader({loadingtext, Icon} : {loadingtext:string, Icon:IconType}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
    <ExtendedMotionDiv
      className="flex items-center space-x-4"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}>
      <Icon className="text-blue-600 text-4xl" />
      <span className="text-2xl font-bold text-blue-700">
        {loadingtext}...
      </span>
    </ExtendedMotionDiv>
  </div>
  )
}

export default Loader
