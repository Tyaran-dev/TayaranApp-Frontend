import React from 'react'

type Props = {}

const CustomProgressBar = (props: Props) => {
    return (
        <div>
            <div className="progress-bar w-full">
                <div className="progress-bar-fill"></div>
            </div>
        </div>
    )
}

export default CustomProgressBar