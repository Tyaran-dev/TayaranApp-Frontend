import React from 'react'
import Section from '../../shared/section'
import SubHeading from '../../shared/subHeading'
import ParaHeading from '../../shared/para-heading'
import CustomLink from '../../shared/customLink'

type Props = { 
     t: (key: string) => string;
}

const BestOffer = (props: Props) => {
    const {t} = props;
    return (
        <div className='bg-greenGradient lg:py-20 py-10'>
            <Section>
                <div data-aos="zoom-in-up" className="flex justify-between items-center gap-5 flex-wrap">
                    <div className="lg:w-3/5 w-full">
                        <SubHeading>{t("bestOffer.bestOfferHeading")}</SubHeading>
                        <ParaHeading>{t("bestOffer.bestOfferText")}</ParaHeading>
                    </div>
                    <CustomLink label={t("bestOffer.bestOfferButton")} href='/signup' className="!bg-orange" />
                </div>
            </Section>
        </div>
    )
}

export default BestOffer