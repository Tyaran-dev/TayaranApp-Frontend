import Image from 'next/image'
import React from 'react'
import loading from '/public/assets/loading.svg'

type Props = {}

const Loading = (props: Props) => {
    return (
        <div className='flex justify-center items-center'>
           <Image src={loading} alt='' className='mx-auto'/>
        </div>
    )
}

export default Loading