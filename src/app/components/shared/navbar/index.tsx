"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "/public/assets/icons/logo.svg";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { Menu } from "lucide-react";
import { WhatApps } from "@/app/svg";
// import { LanguageSwitcher } from "../google-tranlator/language-switcher";
import LanguageSwitcher from "../translate/LanguageSwitcher";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const menuItems = [
  { key: "promo", url: "/promo" },
  { key: "aboutUs", url: "/aboutUs" },
  { key: "packages", url: "/packages" },
  { key: "tayyranBusiness", url: "/tayyran-Business" },
  { key: "corporate", url: "/Corporate" },
];

const Navbar = () => {
  const t = useTranslations('header');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = usePathname();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const isActive = (path: string) => {
    return router === path ? "!text-secondary lg:!text-primary" : "";
  };

  return (
    <div className="w-full  top-0 left-0   bg-white shadow-md text-primary">
      <nav
        className={`lg:px-24 md:px-16 px-5 max-w-[1800px] z-20 flex md:rounded-2xl justify-center mx-auto  py-2 items-start relative top-0 w-full  text-black bg-white`}
      >
        <div className="flex justify-between items-center flex-shrink-0 w-full">
          <Link href="/">
            <Image
              src={logo}
              alt=""
              className=" hover:scale-105 w-24 duration-300 transition-all"
            />
          </Link>
          <div className="lg:flex items-center hidden gap-3 xl:gap-10 ">



          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.url}
              className={`hover:scale-105 hover:text-secondary duration-300 transition-all text-base font-medium font-montserrat ${isActive(item.url)}`}
              onClick={() => setIsModalOpen(false)} // only in mobile nav
            >
              {t(`navItems.${item.key}`)}
            </Link>
          ))}
          </div>



          <div className="lg:flex hidden items-center gap-4">
            <LanguageSwitcher />

            <Link
              href="https://wa.me/012645681444"
              className="flex gap-2 items-center lg:text-base font-medium font-montserrat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatApps />
              0126-4568-1444
            </Link>


            <Link href={'/signup'} className="py-3 px-5 lg:text-base font-medium font-montserrat text-white text-center btn-bg rounded-2xl">{t(`registerButton`)}
            </Link>
          </div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="lg:hidden block py-2 "
          >
            {isModalOpen ? <IoClose size={25} /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className={`bg-primary absolute left-0 top-20 block lg:hidden w-full px-10 z-40 py-10 transition-all ease-in-out lg:min-h-0 min-h-screen duration-500 transform ${isModalOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-[110vh] opacity-40"
        }`}>
        <div className="flex flex-col justify-center gap-2 ">
        {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.url}
              className={`hover:scale-105 hover:text-secondary duration-300 transition-all text-base font-medium font-montserrat ${isActive(item.url)}`}
              onClick={() => setIsModalOpen(false)} // only in mobile nav
            >
              {t(`navItems.${item.key}`)}
              </Link>
          ))}

          <div className="flex flex-col  gap-4">
            <Link
              href="https://wa.me/012645681444"
              className="flex gap-2 items-center text-white lg:text-base font-medium font-montserrat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatApps />
              0126-4568-1444
            </Link>
            <LanguageSwitcher />


            <Link href={'/signup'} className="py-3 px-5 text-white lg:text-base font-medium font-montserrat text-white text-center btn-bg rounded-2xl">{t("registerButton")}</Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
