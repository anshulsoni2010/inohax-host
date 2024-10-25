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
                        <span className="text-2xl">Inohax 1.0</span>
                    </Link>
                    {/* Mobile Menu */}
                    <div className="flex items-center lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Menu
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="cursor-pointer lg:hidden"
                                />
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
                            >
                                <SheetClose asChild>
                                    <div>
                                        <SheetHeader className="mb-4 ml-4">
                                            <SheetTitle className="flex items-center">
                                                <Link href="/" className="flex items-center text-white">
                                                    Inohax 1.0
                                                </Link>
                                            </SheetTitle>
                                        </SheetHeader>

                                        <div className="flex flex-col gap-2">
                                            {routeList.map(({ href, label }) => (
                                                <Button
                                                    key={href}
                                                    onClick={() => setIsOpen(false)}
                                                    asChild
                                                    className="justify-start text-base text-white"
                                                >
                                                    <Link href={href} className="w-full text-left">
                                                        {label}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                                        <Separator className="mb-2" />
                                    </SheetFooter>
                                </SheetClose>
                            </SheetContent>
                        </Sheet>
                    </div>

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
                    <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                        <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </span>
                        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                            <span >
                                Download Inovact Social
                            </span>
                            <svg
                                fill="none"
                                height="16"
                                viewBox="0 0 24 24"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.75 8.75L14.25 12L10.75 15.25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-purple-300/0 via-purple-300/90 to-purple-300/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>                </header>
            )}
        </>
    );
};
