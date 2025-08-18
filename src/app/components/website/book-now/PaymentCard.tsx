import React from 'react'
import { IoAddSharp } from "react-icons/io5";


const PaymentCard = ({ onAddCard }: { onAddCard: () => void }) => {
    return (
        <div className='w-full'>
            <div
                className={`cursor-pointer w-full p-4 rounded-lg flex items-center justify-between space-x-4 bg-greenGradient  text-white`}
            >
                <div className='flex items-center gap-2'>
                    <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.28 0.952148C0.573216 0.952148 0 1.5252 0 2.23215V19.7681C0 20.4751 0.573504 21.0481 1.28 21.0481H30.72C31.4268 21.0481 32 20.4751 32 19.7681V2.23215C32 1.52524 31.4265 0.952148 30.72 0.952148H1.28ZM19.112 6.94114C19.8908 6.94114 20.515 7.11317 20.913 7.27314L20.641 8.98415L20.461 8.89314C20.0902 8.73317 19.614 8.57922 18.957 8.59013C18.1706 8.59013 17.807 8.94095 17.807 9.26917C17.8024 9.639 18.2318 9.8829 18.934 10.2481C20.0929 10.8117 20.6286 11.4949 20.621 12.3931C20.6054 14.0321 19.2347 15.0912 17.123 15.0912C16.2221 15.0812 15.3542 14.8905 14.885 14.6701L15.167 12.9021L15.426 13.0281C16.0858 13.3229 16.513 13.4422 17.317 13.4422C17.8944 13.4422 18.5141 13.2004 18.519 12.6712C18.5228 12.3256 18.26 12.0792 17.478 11.6921C16.716 11.3144 15.7058 10.6817 15.717 9.54716C15.7289 8.0124 17.127 6.94114 19.112 6.94114ZM2.82998 7.19215H6.07299C6.5097 7.20866 6.86227 7.34927 6.984 7.82316L7.68301 11.4312C7.6831 11.4315 7.68288 11.4328 7.68301 11.4331L7.89299 12.5142L9.86199 7.19215H11.992L8.82598 14.9822L6.69798 14.9841L5.004 8.69813C6.01194 9.23212 6.87005 9.84994 7.36701 10.7001C7.23888 10.4311 7.07005 10.1274 6.85402 9.82815C6.60243 9.4796 6.0591 9.02959 5.832 8.83813C5.04064 8.17103 3.96592 7.63224 2.80499 7.34716L2.82998 7.19215ZM12.839 7.20114H14.922L13.619 14.9792H11.536L12.839 7.20114ZM24.604 7.20114H26.182L27.834 14.9792H25.94C25.94 14.9792 25.7521 14.0856 25.691 13.8131C25.3933 13.8131 23.3113 13.8102 23.077 13.8102C22.9977 14.0207 22.647 14.9791 22.647 14.9791H20.504L23.535 7.84716C23.7496 7.34034 24.1154 7.20114 24.604 7.20114ZM24.759 9.29314C24.6565 9.58245 24.4781 10.0497 24.49 10.0291C24.49 10.0291 23.8488 11.7392 23.681 12.1832L25.366 12.1821C25.2095 11.4405 25.0528 10.6988 24.896 9.9572L24.759 9.2932V9.29314Z" fill="#FF7300" />
                    </svg>

                    <h1 className="font-bold ml-6">**** 4321</h1>
                    <p className="text-sm">02/27</p>
                </div>

                <input
                    type="radio"
                    name="payemntCard"
                    value="full"
                    defaultChecked
                    // checked={payType === "full"}
                    // onChange={handlePayTypeChange}
                    className="mt-1 h-5 w-5 cursor-pointer flex-shrink-0 custom-input-color-pay"
                />
            </div>

            {/* Add New Card Button */}
            <div
                onClick={onAddCard}
                className="cursor-pointer border-2 mt-4 border-dashed border-[#C1C1C1] rounded-lg p-10 text-center flex flex-col items-center gap-2"
            >
                <div className="text-[#179AE0] border flex  items-center justify-center rounded-2xl border-[#179AE0]  h-9 w-9 ">
                <IoAddSharp className='text-xl' />
                </div>
                <p className="text-gray-500">Add a new card</p>
            </div>
        </div>
    )
}

export default PaymentCard
