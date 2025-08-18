import React from 'react'
import Section from '../../shared/section'
import SubHeading from '../../shared/subHeading'
import Button from '../../shared/Button'
import mobile from '/public/assets/images/mobile-app.png'
import appstore from '/public/assets/images/appstore.png'
import playstore from '/public/assets/images/aystore.png'
import Image from 'next/image'
import ParaHeading from '../../shared/para-heading'

type Props = { 
    t: (key: string) => string;
}

const MobileAppSection = (props: Props) => {
    const {t} = props;

    return (
        <div>
            <Section>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-center justify-between">
                    <div className="space-y-5 lg:w-3/4">
                        <SubHeading className='!text-grayText'>{t("mobileAppSection.heading")}</SubHeading>
                        <ParaHeading className='!text-black !font-bold'>  {t("mobileAppSection.exprensHeading")} </ParaHeading>
                        <SubHeading className='!text-grayText'>{t("mobileAppSection.subHeading")}</SubHeading>
                        <Button label={t("mobileAppSection.downloadButton")} style="!bg-orange" />
                        <div className="flex gap-5 items-center">
                            <button className="hover:scale-105 duration-300 transition-all">
                                <Image src={appstore} alt='' className='' />
                            </button>

                            <button className="hover:scale-105 duration-300 transition-all">
                                <Image src={playstore} alt='' className='' />
                            </button>
                        </div>

                    </div>
                    <Image src={mobile} alt='' className='' />

                </div>
            </Section>
        </div>
    )
}

export default MobileAppSection