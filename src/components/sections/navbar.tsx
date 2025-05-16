"use client";
import { Menu } from "lucide-react";
import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
// import Image from "next/image";
interface RouteProps {
    href: string;
    label: string;
}

const routeList: RouteProps[] = [
    { href: "https://www.inovact.in", label: "About Inovact" },
    // Add more routes as needed
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            {isMounted && (
                <header className="shadow-inner backdrop-blur-3xl bg-black/40 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-gray-900/45 z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
                    <Link href="/" className="font-bold text-lg flex items-center text-white space-x-3">
                        {/* <Image src="/inovact.webp" className="rounded-full" alt="Inohax Logo" width={50} height={50} /> */}
                        <span className="text-2xl navbar-text">Inohax 2.0</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex relative">
                        {routeList.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="ml-4 text-sm text-white relative group"
                            >
                                {label}
                                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#7877c64d] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>
                        ))}
                    </div>

                </header>
            )}
        </>
    );
};
