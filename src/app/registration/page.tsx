'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Link from 'next/link';
interface FormData {
    teamName: string;
    teamLeaderName: string;
    teamLeaderPhone: string;
    teamLeaderEmail: string;
    inovactSocialLink: string;
}

export default function Component() {
    const { handleSubmit, register, reset } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const registrationEndDate = new Date('2025-05-21T23:59:00');
    const isRegistrationClosed = new Date() > registrationEndDate;

    const onSubmit = async (data: FormData) => {
        setLoading(true); // Set loading to true when submission starts

        const requiredFields: (keyof FormData)[] = [
            'teamName',
            'teamLeaderName',
            'teamLeaderPhone',
            'teamLeaderEmail',
            'inovactSocialLink'
        ];
        let hasError = false; // Flag to track if there are any errors

        // Check if any required fields are empty
        for (const field of requiredFields) {
            if (!data[field as keyof FormData]) { // Use type assertion here
                hasError = true; // Set error flag
                toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required.`);
                break; // Exit loop if any required field is empty
            }
        }

        // If there are errors, stop submission
        if (hasError) {
            return; // Stop submission if any required field is empty
        }

        // Validate Inovact Social Link
        try {
            // Check if it's a valid URL
            const url = new URL(data.inovactSocialLink);

            // Check if it's from the Inovact domain
            if (!url.hostname.includes('inovact.in')) {
                toast.error('Please enter a valid Inovact Social link (e.g., https://inovact.in/...)');
                setLoading(false);
                return;
            }

            // Check if it has an ID parameter
            const postId = url.searchParams.get('id');
            if (!postId) {
                toast.error('Invalid Inovact Social link. Please provide a link with an ID parameter (e.g., ?id=...)');
                setLoading(false);
                return;
            }
        } catch (error) {
            toast.error('Please enter a valid URL for the Inovact Social link');
            setLoading(false);
            return;
        }

        const payload = {
            ...data,
            teamMembers: [], // Set teamMembers to an empty array since we're removing this functionality
        };

        try {
            const response = await fetch('/api/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Registration successful!'); // Use toast for success message
                reset(); // Reset the form fields
            } else {
                toast.error('Registration failed!'); // Use toast for error message
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form. Please try again.'); // Use toast for error message
        } finally {
            setLoading(false); // Set loading to false when submission ends
        }
    };

    // Render registration closed UI if registration is closed
    if (isRegistrationClosed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center bg-red-950/30 p-6 sm:p-8 rounded-lg shadow-2xl backdrop-blur-sm border border-red-800/40">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="text-white ">
                                Registration Closed
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 mt-6">
                            Thank you for your interest in Inohax 2.0! Registration for this event has closed as of May 21st, 2025 at 11:59 PM.
                        </p>
                        <p className="text-base sm:text-lg text-white/85 mt-4 mb-8">
                            Stay tuned for future events by following us on our social media channels.
                        </p>
                        <div className='flex-col sm:flex-row justify-centent items-center'>
                            <Link href="https://chat.whatsapp.com/GClxUdUctuaEUeWmJmNYHo">
                                <button className="bg-blue-950/50 no-underline group cursor-pointer relative shadow-2xl shadow-red-900/20 rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block">
                                    <span className="absolute inset-0 overflow-hidden rounded-full">
                                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(220,38,38,0.6)_0%,rgba(220,38,38,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </span>
                                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-black/80 py-0.5 px-4 ring-1 ring-red-500/20">
                                        <span>Join Inovact Community</span>
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
                                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-indigo-500/0 via-indigo-500/90 to-indigo-500/0 transition-opacity duration-500 group-hover:opacity-40" />
                                </button>
                            </Link>
                            <div className="my-2" /> {/* Added space between buttons */}
                            <Link href="https://play.google.com/store/apps/details?id=in.pranaydas.inovact">
                                <button className="bg-indigo-950/90 no-underline group cursor-pointer relative shadow-2xl shadow-red-900/20 rounded-full p-1 text-sm font-semibold leading-6 text-white inline-block">
                                    <span className="absolute inset-0 overflow-hidden rounded-full">
                                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(220,38,38,0.6)_0%,rgba(220,38,38,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </span>
                                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-black/80 py-0.5 px-4 ring-1 ring-red-500/20">
                                        <span>Download Inovact Social</span>
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
                                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-500/0 via-blue-500/90 to-blue-500/0 transition-opacity duration-500 group-hover:opacity-40" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render registration form if registration is open
    return (
        <>
            <Head>
                <link rel="icon" href="/inovact.png" />
                <title>Inohax 2.0 Registration Form</title>
                <meta name="description" content="A 24 Hours Open Innovation Hackathon by Inovact for Students & Entrepreneurs" />
            </Head>
            <div className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="loader"></div> {/* Circular loader */}
                    </div>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
                                Inohax 2.0 Registration
                            </span>
                        </h1>
                    </div>

                    <Card className="backdrop-blur-lg bg-black/30 border border-gray-700 shadow-2xl shadow-gray-500/20">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-gray-300">Team Registration</CardTitle>
                            <CardDescription className="text-center text-gray-400">Enter your team&apos;s details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="teamName" className="text-gray-300">Team Name *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamName"
                                                    {...register('teamName', { required: true })}
                                                    className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                    placeholder="Enter team name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderName" className="text-gray-300">Team Leader Name *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderName"
                                                    {...register('teamLeaderName', { required: true })}
                                                    className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                    placeholder="Enter leader name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderPhone" className="text-gray-300">Team Leader Phone *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderPhone"
                                                    {...register('teamLeaderPhone', { required: true })}
                                                    type="tel"
                                                    className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderEmail" className="text-gray-300">Team Leader Email *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderEmail"
                                                    {...register('teamLeaderEmail', { required: true })}
                                                    type="email"
                                                    className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="inovactSocialLink" className="text-gray-300">Inovact Social Link *</Label>
                                        <Input
                                            id="inovactSocialLink"
                                            {...register('inovactSocialLink', { required: true })}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500"
                                            placeholder="Enter your Inovact Social link (e.g., https://inovact.in/...?id=...)"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Must be a valid Inovact Social link with an ID parameter (https://inovact.in/...?id=...)
                                        </p>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                    Submit Registration
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                                <p className='text-center'><b>After submitting the form, You will receive an email from us. Do check the spam folder if you do not receive the email in your inbox</b></p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <ToastContainer />
            </div>
        </>
    )
}
