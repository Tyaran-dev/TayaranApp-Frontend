import React, { useState } from "react";

const PaymentOptions = ({ onPaymentChange }: { onPaymentChange: (value: string) => void }) => {
    const [payType, setPayType] = useState<string>("full");

    const handlePayTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        setPayType(selectedValue);
        onPaymentChange(selectedValue);  // Pass the selected payment type back to the parent
    };

    return (
        <div className=" w-full ">
            <div className="flex flex-col space-y-4">
                <label
                    className={`cursor-pointer w-full p-4 rounded-lg flex items-center justify-between space-x-4  ${payType === "full"
                        ? "bg-greenGradient  text-white"
                        : "bg-white text-black "
                        }`}
                >
                    <div>
                        <div className="font-bold">Pay in full</div>
                        <p className="text-sm mt-2">Pay the total and you are all set</p>
                    </div>

                    <input
                        type="radio"
                        name="paytype"
                        value="full"
                        defaultChecked={payType === "full"}
                        onChange={handlePayTypeChange}
                        className="mt-1 h-5 w-5 cursor-pointer flex-shrink-0 custom-input-color-pay"
                    />
                </label>

                <label
                    className={`cursor-pointer p-4 rounded-lg flex items-center justify-between space-x-4  ${payType === "part"
                        ? "bg-greenGradient text-white"
                        : "bg-white text-black "
                        }`}
                >
                    <div>
                        <div className="font-bold">Pay part now, part later</div>
                        <p className="text-sm my-2">
                            Pay $207.43 now, and the rest ($207.43) will be automatically charged to
                            the same payment method on Nov 14, 2022. No extra fees.
                        </p>
                        <a href="#" className="text-sm underline">
                            More info
                        </a>
                    </div>
                    <input
                        type="radio"
                        name="paytype"
                        value="part"
                        defaultChecked={payType === "part"}
                        onChange={handlePayTypeChange}
                        className="mt-1 h-5 w-5 cursor-pointer flex-shrink-0 custom-input-color-pay"
                    />
                </label>
            </div>
        </div>
    );
};

export default PaymentOptions;
