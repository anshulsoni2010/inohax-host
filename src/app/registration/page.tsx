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
    const [redirecting, setRedirecting] = useState(false);
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
            setLoading(false); // Reset loading state
            return; // Stop submission if any required field is empty
        }

        // Validate Inovact Social Link
        try {
            // Check if it's a valid URL
            const url = new URL(data.inovactSocialLink);

            // Check if it's from the Inovact domain
            if (!url.hostname.includes('inovact.in')) {
                toast.error('Please enter a valid Inovact Social link (e.g., https://api.inovact.in/v1/post?id=...)');
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
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
                // Show success message
                toast.success('Registration successful!');

                // Reset the form fields
                reset();

                // Set redirecting state to show a message
                setRedirecting(true);

                // Create the confirmation URL with team info
                const confirmationUrl = `/registration/confirmation?teamName=${encodeURIComponent(data.teamName)}&teamLeaderName=${encodeURIComponent(data.teamLeaderName)}&teamLeaderEmail=${encodeURIComponent(data.teamLeaderEmail)}`;

                // Redirect after a short delay to ensure the toast is visible
                setTimeout(() => {
                    window.location.href = confirmationUrl;
                }, 2000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Registration failed!');
                setLoading(false); // Reset loading state
                setRedirecting(false); // Reset redirecting state
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form. Please try again.'); // Use toast for error message
            setLoading(false); // Reset loading state on error
            setRedirecting(false); // Reset redirecting state
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
            <div className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 ${loading || redirecting ? 'opacity-50' : 'opacity-100'}`}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="loader"></div> {/* Circular loader */}
                    </div>
                )}
                {redirecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="animate-pulse text-green-500 text-4xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                        <p className="text-gray-300">Redirecting to confirmation page...</p>
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
                                        <Label htmlFor="inovactSocialLink" className="text-gray-300">Inovact Social Project Link *</Label>
                                        <Input
                                            id="inovactSocialLink"
                                            {...register('inovactSocialLink', { required: true })}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500"
                                            placeholder="Enter your Inovact Social Project link ( e.g., https://api.inovact.in/v1/post?id=... )"
                                        />

                                        <div className="mt-4 p-5 bg-gradient-to-b from-gray-800/60 to-gray-800/40 border border-gray-700 rounded-lg shadow-inner">
                                            <div className="flex items-center mb-4 pb-3 border-b border-gray-700/50">
                                                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-200">Inovact Social Project Requirement</h3>
                                            </div>

                                            <p className="text-gray-300 mb-4 ml-1">As part of the registration process, all teams must upload their hackathon idea on Inovact Social.</p>
                                            <p className="text-gray-300 mb-4 ml-1">This helps us evaluate your idea, and it also gives your team visibility and credibility on the platform.</p>

                                            <div className="flex flex-wrap gap-4 mb-5 ml-1">
                                                <a href="https://play.google.com/store/search?q=inovact+social&c=apps&hl=en_US" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700/70 hover:bg-gray-600/80 text-blue-300 hover:text-blue-200 rounded-md transition-colors shadow-sm hover:shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 48 48" fill="currentColor">
                                                        <path d="M25.88 24L7.31 42.57C7.1 42.13 7 41.65 7 41.15V6.85c0-.5.1-.98.31-1.42L25.88 24zM28 26.12l6.21 6.21-22.05 11.9c-.52.28-1.09.42-1.66.42-.31 0-.61-.04-.91-.12L28 26.12zM28 21.88L9.6 3.48c.85-.24 1.76-.14 2.56.29l22.05 11.9L28 21.88zM45.79 24c0 1.29-.71 2.47-1.84 3.08l-6.98 3.77L30.12 24l6.85-6.85 6.98 3.77C45.08 21.53 45.79 22.71 45.79 24z" />
                                                    </svg>
                                                    <span>For Android</span>
                                                </a>
                                                <a href="https://apps.apple.com/in/app/inovact-social/id6742887820" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700/70 hover:bg-gray-600/80 text-blue-300 hover:text-blue-200 rounded-md transition-colors shadow-sm hover:shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                                    </svg>
                                                    <span>For iOS</span>
                                                </a>
                                            </div>

                                            <div className="flex items-center mb-3 ml-1 mt-4">
                                                <div className="bg-blue-500/20 p-1.5 rounded-full mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 11 12 14 22 4"></polyline>
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-200 font-medium">Step-by-Step Guide:</p>
                                            </div>

                                            <div className="ml-2 space-y-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-blue-300 text-sm font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <p className="leading-relaxed text-gray-200">Download and Sign Up on Inovact Social</p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-blue-300 text-sm font-bold">2</span>
                                                    </div>
                                                    <div>
                                                        <p className="leading-relaxed text-gray-200 mb-2">
                                                            Upload Your Hackathon Idea as a Project
                                                        </p>
                                                        <ul className="list-none space-y-1.5 ml-1.5 text-sm text-gray-300">
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Open the app and go to "Create Project"</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Fill in:</span>
                                                            </li>
                                                            <li className="flex items-center ml-5">
                                                                <svg className="h-3 w-3 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Title of your hackathon idea</span>
                                                            </li>
                                                            <li className="flex items-center ml-5">
                                                                <svg className="h-3 w-3 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Detailed Description</span>
                                                            </li>
                                                            <li className="flex items-center ml-5">
                                                                <svg className="h-3 w-3 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Any relevant Links (optional)</span>
                                                            </li>
                                                            <li className="flex items-center ml-5">
                                                                <svg className="h-3 w-3 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Add Relevant Keywords (e.g., EdTech, FinTech, AI, etc.)</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Tap Post</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-blue-300 text-sm font-bold">3</span>
                                                    </div>
                                                    <div>
                                                        <p className="leading-relaxed text-gray-200 mb-2">
                                                            Copy the Project Link
                                                        </p>
                                                        <ul className="list-none space-y-1.5 ml-1.5 text-sm text-gray-300">
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Go to Your Profile → Projects</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Click the Share button on your project</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <svg className="h-3.5 w-3.5 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Copy the project link</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-blue-300 text-sm font-bold">4</span>
                                                    </div>
                                                    <p className="leading-relaxed text-gray-200">
                                                        Paste the Link in the Registration Form
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
