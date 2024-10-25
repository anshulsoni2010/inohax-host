'use client'

import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import Countdown from "./countdown";
import PartnersLogo from "./partnerslogo";
import MoneyBag from "./money-bag-rupee-icon (1).png";
import Image from "next/image";
export default function Hero() {
    return (
        <div className="relative min-h-screen">
            <div className="sticky top-3 z-[1]">
                <Navbar />
            </div>
            <div className="absolute inset-0 z-[0] bg-black/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
            <section className="relative z-1">
                <div className="max-w-screen-xl z-10 mx-auto px-4 py-10 sm:py-12 md:py-14 gap-6 text-gray-300">
                    <div className="space-y-8 max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl text-leading md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter font-geist bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent">
                            A 24 hours Online Open Innovation Hackathon for{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-orange-200">
                                Students & Entrepreneurs
                            </span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-gray-400">
                            A Flagship Hackathon by Inovact Social
                        </p>

                        <div className="text-gray-50 text-lg sm:text-xl bg-gradient-to-b from-[#191929]/40 via-black/70 to-[#191929]/40 p-2 sm:p-4  mx-auto rounded-md backdrop-blur-3xl inline-flex items-center justify-center">

                            Stand a chance to win a cash prize of INR 10,000
                            <span className="mx-2"> <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 394 511.98">
                                <path fill="#3E7D52" d="M158.912 88.115c-7.903-23.315-15.02-46.892-21.026-70.838 22.398-24.583 108.964-21.316 133.86-.384l-23.05 54.803c12.396-16.286 16.563-22.97 23.958-32.043a71.446 71.446 0 018.787 6.814c6.557 5.936 12.412 12.495 13.597 21.638.768 5.929-.927 11.952-6.203 18.111l-52.884 61.595c-6.807-1.116-13.459-2.75-19.914-5.044 2.999-7.058 6.616-14.823 9.615-21.882l-19.253 20.795c-20.058-4.232-36.188-1.707-51.219 6.242l-53.632-64.366c-3.186-3.839-4.636-7.678-4.624-11.517.051-15.559 23.218-28.987 35.396-34.07l26.592 50.146z" />
                                <path fill="#366F49" d="M139.295 22.806l-1.408-5.53C143 11.665 151.46 7.507 161.763 4.679c5.995 22.606 12.85 44.928 20.344 67.037l-29.499-55.63c-3.764 1.569-8.476 3.862-13.313 6.72zm109.086 110.528l-12.431 14.478c-6.806-1.117-13.459-2.75-19.912-5.045 1.85-4.358 3.936-8.983 5.968-13.548 4.105.354 8.356.988 12.779 1.921l21.364-23.07c-3.329 7.831-7.343 16.447-10.667 24.276.963.343 1.929.672 2.899.988zm-30.215-4.365l-11.768 12.711c-20.057-4.231-36.186-1.706-51.217 6.243l-53.633-64.368c-3.185-3.839-4.636-7.676-4.623-11.516.03-9.258 8.247-17.761 17.463-24.201-.668 1.974-1.042 3.993-1.049 6.045-.013 4.259 1.595 8.516 5.128 12.775l59.5 71.407c12.315-6.511 25.294-9.743 40.199-9.096z" />
                                <path fill="#3E7D52" d="M227.639 204.409l-10.467-47.871c44.832 8.338 116.691 99.534 139.911 140.998 11.852 21.164 22.232 44.48 30.731 70.545 16.931 63.08.622 122.093-67.807 135.838-42.877 8.614-122.838 9.224-167.93 6.891-48.476-2.509-123.494-2.432-143.09-52.204-31.628-80.338 26.319-176.045 79.155-234.623 6.952-7.708 14.141-14.892 21.579-21.522 19.219-16.91 39.943-36.976 64.682-45.319l-23.895 44.495 34.705-46.011h18.288l24.138 48.783z" />
                                <path fill="#499560" d="M227.64 204.408l-10.467-47.871c100.985 37.366 274.435 303.922 75.77 306.108-337.547 3.716-272.661-41.47-183.221-260.184 19.219-16.909 39.944-36.976 64.681-45.32l-23.896 44.496 34.707-46.01h18.287l24.139 48.781z" />
                                <path fill="#3E7D52" d="M227.64 204.408l-4.535-20.74c78.872 60.049 179.837 226.097 103.746 274.941-9.691 2.5-20.964 2.775-33.908 4.036-342.946 33.418-276.078-22.116-183.221-260.184 12.559-11.05 25.761-23.448 40.305-33.041l-22.496 41.89 34.707-46.009h7.782l-19.513 36.336 27.41-36.336h2.608l24.139 48.78-10.467-47.871c-6.807-1.116-13.459-2.75-19.914-5.044 2.999-7.058 6.616-14.823 9.615-21.882l-19.253 20.795c-20.058-4.232-36.188-1.707-51.219 6.242l-53.632-64.366c-3.186-3.839-4.636-7.676-4.623-11.516.03-9.258 8.247-17.761 17.463-24.201-.668 1.974-1.042 3.993-1.049 6.045-.013 4.259 1.595 8.516 5.128 12.775l59.5 71.407c12.315-6.511 25.294-9.743 40.199-9.096z" />
                                <circle fill="#68BE7C" transform="scale(24.9353) rotate(-61.974 15.208 .304)" r="3.937" />
                                <path fill="#3E7D52" fill-rule="nonzero" d="M150.861 326.789l6.423-14.465c.207-.468.475-.888.793-1.254h-2.866a5.018 5.018 0 01-4.35-7.52l6.423-14.465a4.985 4.985 0 014.564-2.972v-.028h71.641a5.018 5.018 0 014.349 7.517l-6.42 14.468a4.986 4.986 0 01-.793 1.253h2.864a5.019 5.019 0 014.349 7.518l-6.42 14.468a4.987 4.987 0 01-4.564 2.972v.028h-10.401c-2.634 4.82-6.638 8.927-11.286 12.178-3.521 2.459-7.436 4.441-11.407 5.869l31.628 32.563a5.005 5.005 0 01-.099 7.075 4.983 4.983 0 01-3.488 1.415l-29.76.015a5.009 5.009 0 01-3.918-1.883l-33.352-36.594a4.998 4.998 0 01-1.304-3.369l-.01-13.725c0-1.388.564-2.644 1.474-3.552a5.02 5.02 0 01-4.07-7.512z" />
                                <path fill="#fff" fill-rule="nonzero" d="M155.212 329.29l6.636-14.948h25.028c-1.58-5.304-7.783-8.29-12.978-8.29h-18.686l6.636-14.949h71.641l-6.636 14.949h-17.305c2.298 1.762 4.757 5.39 5.187 8.29h18.754l-6.636 14.948h-13.568c-4.379 11.15-17.736 18.724-29.127 20.363l37.644 38.753H192.04l-33.567-36.828v-13.726h14.858c5.057 0 11.353-3.552 12.956-8.562h-31.075z" />
                            </svg></span>                        </div>
                        <div className="flex justify-center items-center">

                            <Link href="/registration">
                                <h1 className="text-sm sm:text-base text-gray-400 group font-geist mx-auto px-3 sm:px-4 py-4 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent border-[2px] border-[#7877c64d]/15 rounded-full flex items-center justify-center w-fit">
                                    Register Now
                                    <div className="flex overflow-hidden relative justify-center items-center ml-2 w-4 sm:w-5 h-4 sm:h-5">
                                        <ArrowUpRight className="absolute transition-all duration-500 group-hover:translate-x-4 group-hover:-translate-y-5" />
                                        <ArrowUpRight className="absolute transition-all duration-500 -translate-x-4 -translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0" />
                                    </div>
                                </h1>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10">
                        <Countdown />
                    </div>
                    <div className="mt-10">
                        <PartnersLogo />
                    </div>
                </div>
            </section>
        </div>
    );
}
