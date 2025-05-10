'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, AlertCircle } from 'lucide-react'
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

// Validation patterns
const PATTERNS = {
    // Allow only letters, numbers, spaces, and common punctuation
    NAME: /^[A-Za-z0-9\s.,'-]+$/,
    // Basic email validation
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Allow Indian phone numbers (10 digits, optional +91 prefix)
    PHONE: /^(\+91)?[6-9]\d{9}$/,
    // Basic URL validation
    URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}

export default function Component() {
    // Reference to the hidden form for new tab redirection
    const confirmationFormRef = React.useRef<HTMLFormElement>(null);

    const {
        handleSubmit,
        register,
        reset,
        watch,
        formState: { errors, isDirty, isSubmitting }
    } = useForm<FormData>({
        mode: 'all', // Validate on all events
        criteriaMode: 'all', // Show all validation errors
        defaultValues: {
            teamName: '',
            teamLeaderName: '',
            teamLeaderPhone: '',
            teamLeaderEmail: '',
            inovactSocialLink: ''
        }
    });

    // Watch all form fields to determine if form is complete
    const watchAllFields = watch();

    // Check if all required fields are filled
    const isFormComplete = Boolean(
        watchAllFields.teamName &&
        watchAllFields.teamLeaderName &&
        watchAllFields.teamLeaderPhone &&
        watchAllFields.teamLeaderEmail &&
        watchAllFields.inovactSocialLink
    );

    const [loading, setLoading] = useState(false);
    const registrationEndDate = new Date('2025-05-21T23:59:00');
    const isRegistrationClosed = new Date() > registrationEndDate;

    const onSubmit = async (data: FormData) => {
        // Form is already validated by react-hook-form
        // This function will only be called if all validations pass
        setLoading(true); // Set loading to true when submission starts

        // The Inovact Social Link is already validated by react-hook-form
        // This is just an additional check for extra security
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
                // Show success message
                toast.success('Registration successful!');

                // Reset the form fields
                reset();

                // Set the form input values
                if (confirmationFormRef.current) {
                    const teamNameInput = confirmationFormRef.current.querySelector('input[name="teamName"]') as HTMLInputElement;
                    const teamLeaderNameInput = confirmationFormRef.current.querySelector('input[name="teamLeaderName"]') as HTMLInputElement;
                    const teamLeaderEmailInput = confirmationFormRef.current.querySelector('input[name="teamLeaderEmail"]') as HTMLInputElement;

                    if (teamNameInput) teamNameInput.value = data.teamName;
                    if (teamLeaderNameInput) teamLeaderNameInput.value = data.teamLeaderName;
                    if (teamLeaderEmailInput) teamLeaderEmailInput.value = data.teamLeaderEmail;

                    // Submit the form to open in a new tab
                    confirmationFormRef.current.submit();
                } else {
                    // Fallback if form ref is not available
                    const confirmationUrl = `/registration/confirmation?teamName=${encodeURIComponent(data.teamName)}&teamLeaderName=${encodeURIComponent(data.teamLeaderName)}&teamLeaderEmail=${encodeURIComponent(data.teamLeaderEmail)}`;
                    window.open(confirmationUrl, '_blank');
                }

                // Reset loading state
                setLoading(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Registration failed!');
                setLoading(false); // Reset loading state
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form. Please try again.'); // Use toast for error message
            setLoading(false); // Reset loading state on error
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
                                                    {...register('teamName', {
                                                        required: 'Team name is required',
                                                        minLength: { value: 2, message: 'Team name must be at least 2 characters' },
                                                        maxLength: { value: 50, message: 'Team name must be less than 50 characters' },
                                                        pattern: { value: PATTERNS.NAME, message: 'Please enter a valid team name' }
                                                    })}
                                                    className={`bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10 ${errors.teamName ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    placeholder="Enter team name"
                                                    aria-invalid={errors.teamName ? "true" : "false"}
                                                />
                                                {errors.teamName && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.teamName.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderName" className="text-gray-300">Team Leader Name *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderName"
                                                    {...register('teamLeaderName', {
                                                        required: 'Team leader name is required',
                                                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                                        maxLength: { value: 50, message: 'Name must be less than 50 characters' },
                                                        pattern: { value: PATTERNS.NAME, message: 'Please enter a valid name' }
                                                    })}
                                                    className={`bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10 ${errors.teamLeaderName ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    placeholder="Enter leader name"
                                                    aria-invalid={errors.teamLeaderName ? "true" : "false"}
                                                />
                                                {errors.teamLeaderName && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.teamLeaderName.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderPhone" className="text-gray-300">Team Leader Phone *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderPhone"
                                                    {...register('teamLeaderPhone', {
                                                        required: 'Phone number is required',
                                                        pattern: { value: PATTERNS.PHONE, message: 'Please enter a valid Indian phone number (10 digits)' }
                                                    })}
                                                    type="tel"
                                                    className={`bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10 ${errors.teamLeaderPhone ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    placeholder="Enter phone number (e.g., 9876543210)"
                                                    aria-invalid={errors.teamLeaderPhone ? "true" : "false"}
                                                />
                                                {errors.teamLeaderPhone && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.teamLeaderPhone.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamLeaderEmail" className="text-gray-300">Team Leader Email *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="teamLeaderEmail"
                                                    {...register('teamLeaderEmail', {
                                                        required: 'Email address is required',
                                                        pattern: { value: PATTERNS.EMAIL, message: 'Please enter a valid email address' }
                                                    })}
                                                    type="email"
                                                    className={`bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10 ${errors.teamLeaderEmail ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    placeholder="Enter email address"
                                                    aria-invalid={errors.teamLeaderEmail ? "true" : "false"}
                                                />
                                                {errors.teamLeaderEmail && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.teamLeaderEmail.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="inovactSocialLink" className="text-gray-300">Inovact Social Project Link *</Label>
                                        <Input
                                            id="inovactSocialLink"
                                            {...register('inovactSocialLink', {
                                                required: 'Inovact Social Project link is required',
                                                pattern: {
                                                    value: /^https?:\/\/.*inovact\.in.*\?id=.*$/i,
                                                    message: 'Please enter a valid Inovact Social link (e.g., https://api.inovact.in/v1/post?id=...)'
                                                }
                                            })}
                                            className={`bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 ${errors.inovactSocialLink ? 'border-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Enter your Inovact Social Project link ( e.g., https://api.inovact.in/v1/post?id=... )"
                                            aria-invalid={errors.inovactSocialLink ? "true" : "false"}
                                        />
                                        {errors.inovactSocialLink && (
                                            <div className="text-red-500 text-sm mt-1 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.inovactSocialLink.message}
                                            </div>
                                        )}

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

                                            <p className="text-gray-300 mb-2 ml-0 text-left text-sm">As part of the registration process, all teams must upload their hackathon idea on Inovact Social.</p>
                                            <p className="text-gray-300 mb-2 ml-0 text-left text-sm">This helps us evaluate your idea, and it also gives your team visibility and credibility on the platform.</p>

                                            <div className="flex flex-wrap gap-2 mb-3 ml-0 text-left">
                                                <a href="https://play.google.com/store/search?q=inovact+social&c=apps&hl=en_US" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 bg-gray-700/70 hover:bg-gray-600/80 text-blue-300 hover:text-blue-200 rounded-md transition-colors shadow-sm hover:shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 48 48" fill="currentColor">
                                                        <path d="M25.88 24L7.31 42.57C7.1 42.13 7 41.65 7 41.15V6.85c0-.5.1-.98.31-1.42L25.88 24zM28 26.12l6.21 6.21-22.05 11.9c-.52.28-1.09.42-1.66.42-.31 0-.61-.04-.91-.12L28 26.12zM28 21.88L9.6 3.48c.85-.24 1.76-.14 2.56.29l22.05 11.9L28 21.88zM45.79 24c0 1.29-.71 2.47-1.84 3.08l-6.98 3.77L30.12 24l6.85-6.85 6.98 3.77C45.08 21.53 45.79 22.71 45.79 24z" />
                                                    </svg>
                                                    <span>For Android</span>
                                                </a>
                                                <a href="https://apps.apple.com/in/app/inovact-social/id6742887820" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 bg-gray-700/70 hover:bg-gray-600/80 text-blue-300 hover:text-blue-200 rounded-md transition-colors shadow-sm hover:shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                                    </svg>
                                                    <span>For iOS</span>
                                                </a>
                                            </div>

                                            <div className="flex items-center mb-2 ml-0 mt-2 text-left">
                                                <div className="bg-blue-500/20 p-1 rounded-full mr-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 11 12 14 22 4"></polyline>
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-200 font-medium text-left text-sm">Step-by-Step Guide:</p>
                                            </div>

                                            <div className="ml-0 space-y-3 text-left">
                                                <div className="flex items-start pl-0">
                                                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-1 mt-0.5">
                                                        <span className="text-blue-300 text-xs font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <p className="leading-tight text-gray-200 text-left">Download and Sign Up on Inovact Social</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start pl-0">
                                                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-1 mt-0.5">
                                                        <span className="text-blue-300 text-xs font-bold">2</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="leading-tight text-gray-200 mb-1 text-left">
                                                            Upload Your Hackathon Idea as a Project
                                                        </p>
                                                        <ul className="list-none space-y-1 ml-0 pl-0 text-sm text-gray-300 text-left">
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Open the app and go to "Create Project"</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Fill in:</span>
                                                            </li>
                                                            <li className="flex items-start ml-0 sm:ml-5 pl-2">
                                                                <svg className="h-2.5 w-2.5 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Title of your hackathon idea</span>
                                                            </li>
                                                            <li className="flex items-start ml-0 sm:ml-5 pl-2">
                                                                <svg className="h-2.5 w-2.5 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Detailed Description</span>
                                                            </li>
                                                            <li className="flex items-start ml-0 sm:ml-5 pl-2">
                                                                <svg className="h-2.5 w-2.5 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Any relevant Links (optional)</span>
                                                            </li>
                                                            <li className="flex items-start ml-0 sm:ml-5 pl-2">
                                                                <svg className="h-2.5 w-2.5 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Add Relevant Keywords (e.g., EdTech, FinTech, AI, etc.)</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Tap Post</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="flex items-start pl-0">
                                                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-1 mt-0.5">
                                                        <span className="text-blue-300 text-xs font-bold">3</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="leading-tight text-gray-200 mb-1 text-left">
                                                            Copy the Project Link
                                                        </p>
                                                        <ul className="list-none space-y-1 ml-0 pl-0 text-sm text-gray-300 text-left">
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Go to Your Profile → Projects</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Click the Share button on your project</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <svg className="h-3 w-3 mr-0.5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <span>Copy the project link</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="flex items-start pl-0">
                                                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-1 mt-0.5">
                                                        <span className="text-blue-300 text-xs font-bold">4</span>
                                                    </div>
                                                    <p className="leading-tight text-gray-200 text-left">
                                                        Paste the Link in the Registration Form
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r ${
                                        !isFormComplete || Object.keys(errors).length > 0
                                            ? 'from-gray-600 to-gray-800 opacity-70 cursor-not-allowed'
                                            : 'from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transform hover:scale-105'
                                    } text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out`}
                                    disabled={!isFormComplete || Object.keys(errors).length > 0 || isSubmitting || loading}
                                >
                                    {isSubmitting || loading ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Submit Registration
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                                {!isFormComplete && isDirty && (
                                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md">
                                        <p className="text-yellow-400 text-sm flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Please fill in all required fields to enable the submit button.
                                        </p>
                                    </div>
                                )}
                                {(Object.keys(errors).length > 0 && isDirty) && (
                                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-md">
                                        <p className="text-red-400 text-sm flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Please fix the errors above before submitting the form.
                                        </p>
                                    </div>
                                )}
                                <p className='text-center'><b>After submitting the form, You will receive an email from us. Do check the spam folder if you do not receive the email in your inbox</b></p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <ToastContainer />

                {/* Hidden form for opening confirmation in new tab */}
                <form
                    ref={confirmationFormRef}
                    action="/registration/confirmation"
                    method="get"
                    target="_blank"
                    style={{ display: 'none' }}
                >
                    <input type="hidden" name="teamName" />
                    <input type="hidden" name="teamLeaderName" />
                    <input type="hidden" name="teamLeaderEmail" />
                </form>
            </div>
        </>
    )
}