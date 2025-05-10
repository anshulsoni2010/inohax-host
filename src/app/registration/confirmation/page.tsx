'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, Calendar, Mail, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'
import { Separator } from '@/components/ui/separator'
import { useSearchParams } from 'next/navigation'

// Loading component to show while the page is loading
function ConfirmationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="loader"></div>
      <p className="ml-4 text-xl font-medium">Loading confirmation...</p>
    </div>
  )
}

// Component that uses searchParams
function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [teamInfo, setTeamInfo] = useState({
    teamName: searchParams.get('teamName') || 'Your Team',
    teamLeaderName: searchParams.get('teamLeaderName') || '',
    teamLeaderEmail: searchParams.get('teamLeaderEmail') || '',
  })

  const [confettiActive, setConfettiActive] = useState(false)

  // Trigger confetti animation on component mount
  useEffect(() => {
    setConfettiActive(true)

    // Disable confetti after 5 seconds
    const timer = setTimeout(() => {
      setConfettiActive(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/inovact.png" />
        <title>Registration Confirmed | Inohax 2.0</title>
        <meta name="description" content="Your registration for Inohax 2.0 has been confirmed!" />
      </Head>

      {/* Confetti animation */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 confetti-container">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
                Registration Confirmed!
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Thank you for registering for Inohax 2.0. Your team is now officially part of the hackathon!
            </p>
          </div>

          <Card className="backdrop-blur-lg bg-black/30 border border-gray-700 shadow-2xl shadow-green-500/10 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-300">Registration Details</CardTitle>
              <CardDescription className="text-center text-gray-400">Your team information has been recorded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">Team Name</h3>
                    <p className="text-gray-300">{teamInfo.teamName}</p>
                  </div>
                </div>

                {teamInfo.teamLeaderName && (
                  <div className="flex items-start space-x-4">
                    <Users className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200">Team Leader</h3>
                      <p className="text-gray-300">{teamInfo.teamLeaderName}</p>
                    </div>
                  </div>
                )}

                {teamInfo.teamLeaderEmail && (
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200">Contact Email</h3>
                      <p className="text-gray-300">{teamInfo.teamLeaderEmail}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <Calendar className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">Event Date</h3>
                    <p className="text-gray-300">May 23-24, 2025</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-200">What's Next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Check your email for a confirmation message with additional details</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Join our community channels to connect with other participants</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Prepare your team and start brainstorming ideas for the hackathon</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Mark your calendar for May 23-24, 2025</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>

            <Link href="https://chat.whatsapp.com/GClxUdUctuaEUeWmJmNYHo">
              <Button variant="secondary" className="w-full sm:w-auto">
                Join Community
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="https://play.google.com/store/apps/details?id=in.pranaydas.inovact">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-black">
                Download Inovact App
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// Main component with Suspense boundary
export default function RegistrationConfirmation() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationContent />
    </Suspense>
  )
}
