"use client"

import React, { useRef } from 'react'
import { Calendar, Clock } from 'lucide-react'

const events = [
    { date: "10th May", time: "", title: "Applications Open", icon: "🚀", color: "from-purple-400 to-indigo-400" },
    { date: "20th May", time: "11:59 PM", title: "Registration Closes", icon: "🔒", color: "from-red-400 to-orange-400" },
    { date: "23rd May", time: "11 AM", title: "Hackathon Kick-off", icon: "🎬", color: "from-blue-400 to-cyan-400" },
    { date: "23rd May", time: "12 PM", title: "Hackathon Starts", icon: "🏁", color: "from-green-400 to-emerald-400" },
    { date: "23rd May", time: "5 PM", title: "First Mentorship Round", icon: "🧠", color: "from-yellow-400 to-amber-400" },
    { date: "24th May", time: "12 PM", title: "Hackathon Ends", icon: "🏁", color: "from-green-400 to-emerald-400" },
    { date: "24th May", time: "9 AM", title: "Second Mentorship Round", icon: "💡", color: "from-orange-400 to-red-400" },
    { date: "24th May", time: "12 PM", title: "Final Submission", icon: "📤", color: "from-pink-400 to-rose-400" },
    { date: "24th May", time: "3 PM", title: "Winner Announcement", icon: "🏆", color: "from-purple-400 to-indigo-400" },
]

export default function Component() {
    const timelineRef = useRef<HTMLDivElement>(null)

    return (
        <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center overflow-hidden">
            <h3 className="text-gray-200 text-3xl font-semibold sm:text-4xl font-geist tracking-tighter text-center">
                Hackathon Timeline
            </h3>
            <div className="w-full max-w-3xl relative mt-12" ref={timelineRef}>
                <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-transparent rounded-full" />
                {events.map((event, index) => (
                    <TimelineEvent
                        key={index}
                        event={event}
                    />
                ))}
            </div>
        </div>
    )
}

interface TimelineEventProps {
    event: {
        date: string
        time: string
        title: string
        icon: string
        color: string
    }
}

function TimelineEvent({ event }: TimelineEventProps) {
    return (
        <div className="mb-12 flex">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center z-10 shadow-lg border border-gray-700">
                <span className="text-3xl">{event.icon}</span>
            </div>
            <div className="ml-8 flex-1">
                <div className="bg-black rounded-2xl p-6 shadow-xl border border-gray-700 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className={`text-2xl font-bold text-white`}>
                            {event.title}
                        </h2>
                    </div>
                    <div className="flex items-center text-lg text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-lg text-purple-400" />
                        {event.date}
                        {event.time && (
                            <>
                                <Clock className="w-4 h-4 ml-4 mr-2 text-purple-400" />
                                {event.time}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
