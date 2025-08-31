// app/[lang]/page.tsx
'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Coins, MapPin, TrendingUp, Users, Zap } from 'lucide-react';
import Section from '../../shared/section';

export default function Home() {
    const t = useTranslations("HomePage.milecoin");
    const locale = useLocale()

    return (


        <div className="min-h-screen ">

            <div className="text-center mb-16 bg-emerald-50 w-full p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{t('intro.title')}</h2>
                <p className="text-base text-gray-600 max-w-3xl mx-auto">
                    {t('intro.description')}
                </p>
            </div>
            <Section>
                {/* MileCoin Brief Section */}
                <section className="px-4 sm:px-6 lg:px-8 bg-white">
                    <div className=" mx-auto">


                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium mb-6">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {t('intro.tag')}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    {t('intro.heading')}
                                </h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {t('intro.content')}
                                </p>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-2 space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{t('intro.features.eco')}</span>
                                    </div>
                                    <div className="flex items-center  gap-2 space-x-3">
                                        <div className="w-8 h-8 bg-blue-100  rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">{t('intro.features.rewards')}</span>
                                    </div>
                                    <div className="flex items-center  gap-2 space-x-3">
                                        <div className="w-8 h-8 bg-purple-100  rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">{t('intro.features.accessible')}</span>
                                    </div>
                                </div>
                                <Link href={`/${locale}/milecoin`} className="group bg-emerald-600 text-white font-medium py-3 px-6 rounded-md inline-flex items-center transition-colors">
                                    {t('intro.cta')}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="bg-greenGradient rounded-2xl p-8 text-white">
                                    <div className="text-center">
                                        <Coins className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                                        <h4 className="text-2xl font-bold mb-4">{t('howItWorks.title')}</h4>
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                                <span>{t('howItWorks.steps.1')}</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                                <span>{t('howItWorks.steps.2')}</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                                <span>{t('howItWorks.steps.3')}</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                                <span>{t('howItWorks.steps.4')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-3xl font-bold text-blue-600">1M+</div>
                                <p className="text-gray-500 mt-2">{t('stats.miles')}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-3xl font-bold text-green-600">50K+</div>
                                <p className="text-gray-500 mt-2">{t('stats.miners')}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-3xl font-bold text-purple-600">Zero</div>
                                <p className="text-gray-500 mt-2">{t('stats.footprint')}</p>
                            </div>
                        </div>
                    </div>
                </section>

            </Section>


            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-greenGradient">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        {t('cta.description')}
                    </p>
                    <Link href="/milecoin" className="group bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md inline-flex items-center transition-colors">
                        {t('cta.button')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div >
    );
}