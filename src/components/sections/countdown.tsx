"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const useCountdown = () => {
  const calculateTimeLeft = () => {
    const now = new Date()
    // Set target date to May 24, 2025 at midnight (23:59:00)
    let targetDate = new Date('2025-05-24T00:00:00')

    const difference = targetDate.getTime() - now.getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false,
      targetDate: targetDate
    }
  }

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft()) // Initialize with a function

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

const AnimatedNumber = ({ number }: { number: number }) => (
  <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-b from-[#7877c64d]/40 to-black/70 rounded-lg shadow-lg"></div>
    <div className="absolute inset-0.5 bg-black rounded-lg flex items-center justify-center overflow-hidden">
      <AnimatePresence mode='wait'>
        <motion.span
          key={number}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#38bdf899] to-white/50"
        >
          {number.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
)

const TimeUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <AnimatedNumber number={value} />
    <span className="mt-2 text-sm font-medium text-gray-300 uppercase tracking-wider">{label}</span>
  </div>
)

export default function Countdown() {
  const timeLeft = useCountdown(); // Ensure this uses state and effects properly

  return (
    <div className="w-full">
      <div className="bg-black bg-opacity-70 p-12 rounded-3xl shadow-2xl backdrop-blur-xl">
        {timeLeft.isComplete ? (
          <p className="text-center text-4xl font-bold text-red-500">Registration Closed!</p>
        ) : (
          <div className="flex justify-center space-x-4 px-20">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        )}
      </div>
    </div>
  )
}
