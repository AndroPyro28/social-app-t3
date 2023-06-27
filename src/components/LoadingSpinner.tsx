import React from 'react'
import { VscRefresh } from 'react-icons/vsc'


type LoaderSpinnerProps = {
    big?: boolean
}
function LoadingSpinner({big=false}: LoaderSpinnerProps) {
    const sizeClasses = big ? `h-16 w-16` : `w-10 h-10`
  return (
    <div className='flex justify-center p-2'>
        <VscRefresh className={`animate-spin ${sizeClasses}`} />
    </div>
  )
}

export default LoadingSpinner