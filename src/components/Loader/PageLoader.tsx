import React from 'react'
import CircleLoader from './CircleLoader'

const PageLoader: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center py-24">
      <CircleLoader className="text-blue-300 square-28" />
    </div>
  )
}

export default PageLoader
