import React from 'react'
import Image from "next/image";
type Tprops = {
  thumbnail?: any
}

const PhotoView: React.FC<Tprops> = ({ thumbnail }) => {
  return (
    <>
      <div>
          <Image src={thumbnail} alt='imgae upload' width='50' height='50' />
      </div>
    </>
  )
}
export default PhotoView