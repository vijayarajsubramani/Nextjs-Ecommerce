import Head from 'next/head'
import React from 'react'
type Tprops={
    title?:string
}

 const Title:React.FC<Tprops> = ({title}) => {
  return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} key="title" />
            </Head>
        </>
  )
}
export default Title