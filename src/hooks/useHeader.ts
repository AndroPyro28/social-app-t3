import React, { useEffect, useLayoutEffect } from 'react'

const useHeader = (title: string) => {
  useLayoutEffect(() => {
    document.title = `Social App - ${title}`
  }, [])
}
export default useHeader