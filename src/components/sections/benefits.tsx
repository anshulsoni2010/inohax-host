import React from "react";
import { Users, GraduationCap, Trophy } from 'lucide-react'; // Importing relevant icons

export default function Benefits() {
    const features = [
        {
            icon: <Users className="w-6 h-6" />, // Team icon
            title: "Team Up & Create",
            desc: "Work with awesome people from different fields, bringing your ideas together to build something cool and innovative.",
        },
        {
            icon: <GraduationCap className="w-6 h-6" />, // Mentor icon
            title: "Learn from the Best",
            desc: "Get one-on-one advice from experienced mentors who’ll help you sharpen your skills and level up your project.",
        },
        {
            icon: <Trophy className="w-6 h-6" />, // Rewards icon
            title: "Show Off & Win",
            desc: "Showcase your hard work to a panel of experts and grab the chance to win exciting rewards, including INR 10,000 in cash!",
        },
    ];

    return (
        <section className="">
            <div className="max-w-screen-xl mx-auto px-6 text-gray-400 md:px-8">
                <div className="relative max-w-2xl mx-auto sm:text-center">
                    <div className="relative z-10">
                        <h3 className="text-gray-200 text-center text-3xl font-semibold sm:text-4xl font-geist tracking-tighter">
                            Why Participate?
                        </h3>
                    </div>
                    <div
                        className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]"
                        style={{
                            background:
                                "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
                        }}
                    ></div>
                </div>
                <div className="relative mt-12">
                    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((item, idx) => (
                            <li
                                key={idx}
                                className="bg-transparent transform-gpu [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#8686f01f_inset]  space-y-3 p-4 border rounded-xl"
                            >
                                <div className="text-purple-600 rounded-full p-4 transform-gpu [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit">{item.icon}</div>
                                <h4 className="text-lg text-gray-300 font-bold font-geist tracking-tighter">
                                    {item.title}
                                </h4>
                                <p className="text-gray-500">{item.desc}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
