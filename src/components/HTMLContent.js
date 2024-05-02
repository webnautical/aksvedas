import React from 'react'

const HTMLContent = ({data}) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default HTMLContent