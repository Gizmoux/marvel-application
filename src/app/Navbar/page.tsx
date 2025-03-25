"use client";
import Link from "next/link";
import logo from "../assets/images/logo.svg";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  CiUser,
  CiLogin,
  CiLogout,
  CiHeart,
  CiMenuBurger,
} from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/characters", label: "Characters", icon: null },
    { href: "/comics", label: "Comics", icon: null },
    {
      href: "/favourite",
      label: "Favorites",
      icon: <CiHeart className="inline-block mr-2" />,
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Marvel Logo"
            className="w-40 h-14 object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <AiOutlineClose className="w-8 h-8" />
            ) : (
              <CiMenuBurger className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`
          ${isMenuOpen ? "flex" : "hidden"} 
          md:flex 
          flex-col 
          md:flex-row 
          absolute 
          md:relative 
          top-full 
          left-0 
          right-0 
          bg-black 
          md:bg-transparent 
          z-50
        `}
        >
          {navItems.map((item) => (
            <li key={item.href} className="md:mr-6">
              <Link
                href={item.href}
                className="
                  block 
                  px-4 
                  py-2 
                  md:p-0 
                  hover:text-red-500 
                  transition-colors 
                  duration-300 
                  text-center
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label} {item.icon}
              </Link>
            </li>
          ))}

          {/* Authentication Buttons */}
          {!session ? (
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => signIn("google")}
                className="
                  flex 
                  items-center 
                  justify-center 
                  bg-red-600 
                  hover:bg-red-700 
                  text-white 
                  px-4 
                  py-2 
                  rounded-md 
                  transition-colors 
                  duration-300
                "
              >
                <CiUser className="mr-2" /> Google
              </button>
              <button
                onClick={() => signIn("github")}
                className="
                  flex 
                  items-center 
                  justify-center 
                  bg-gray-800 
                  hover:bg-gray-700 
                  text-white 
                  px-4 
                  py-2 
                  rounded-md 
                  transition-colors 
                  duration-300
                "
              >
                <CiLogin className="mr-2" /> GitHub
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span>{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="
                  flex 
                  items-center 
                  justify-center 
                  bg-red-600 
                  hover:bg-red-700 
                  text-white 
                  px-4 
                  py-2 
                  rounded-md 
                  transition-colors 
                  duration-300
                "
              >
                <CiLogout className="mr-2" /> Sign Out
              </button>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
