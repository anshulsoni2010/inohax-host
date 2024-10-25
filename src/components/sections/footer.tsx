import React from "react";
import LinkArrow from "./linkArrow";
import Link from "next/link";

function Footer() {
    return (
        <footer className="mt-5 w-full border-t border-2 border-zinc-800/30 flex flex-col items-center justify-center gap-4 px-4 py-6 text-sm text-zinc-500 text-center">
            <p className="mb-2">© 2024 Inohax 1.0</p>
            <Link href="/registration" target="_blank">
                <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block">
                    <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </span>
                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                        <span>Register Now</span>
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
                </button>
            </Link>
            <div className="flex gap-3 text-center flex-row md:gap-5 justify-center my-2 ">
                <a
                    className="group/mail flex items-center"
                    target="_blank"
                    href="mailto:inovacteam@gmail.com"
                >
                    Contact
                    <LinkArrow classname="group-hover/mail:opacity-100 opacity-0 transition hidden md:block" />
                </a>
                <a
                    className="group/community flex items-center"
                    target="_blank"
                    href="https://chat.whatsapp.com/GClxUdUctuaEUeWmJmNYHo"
                >
                    Join Inovact Community
                    <LinkArrow classname="group-hover/community:opacity-100 opacity-0 transition hidden md:block" />
                </a>
            </div>
            <p className="mt-2 text-lg text-zinc-400">
                For any queries, feel free to contact Shubham at <a href="https://wa.me/919818273220" target="_blank" rel="noopener noreferrer" className="text-blue-500">Contact - +91 98182 73220</a>
            </p>
        </footer>
    );
}

export default Footer;
