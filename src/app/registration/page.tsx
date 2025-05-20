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
            teamLeaderEmail: ''
        }
    });

    // Watch all form fields to determine if form is complete
    const watchAllFields = watch();

    // Check if all required fields are filled
    const isFormComplete = Boolean(
        watchAllFields.teamName &&
        watchAllFields.teamLeaderName &&
        watchAllFields.teamLeaderPhone &&
        watchAllFields.teamLeaderEmail
    );

    const [loading, setLoading] = useState(false);
    const isRegistrationClosed = true; // Force registration to be closed

    const onSubmit = async (data: FormData) => {
        // Form is already validated by react-hook-form
        // This function will only be called if all validations pass
        setLoading(true); // Set loading to true when submission starts



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

                // Special handling for database connection errors
                if (errorData.error === 'REGISTRATIONS_STOPPED') {
                // Show the registrations stopped message
                toast.error('Registrations have been stopped. Thank you for your interest!');
            } else if (errorData.error && errorData.error.includes("Database connection is not available")) {
                    // Try again automatically - this will use the already established connection
                    console.log("Database connection error detected, retrying submission...");

                    // Small delay before retrying
                    setTimeout(async () => {
                        try {
                            const retryResponse = await fetch('/api/registration', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                            });

                            if (retryResponse.ok) {
                                // Show success message
                                toast.success('Registration successful!');

                                // Reset the form fields
                                reset();

                                // Set the form input values and redirect
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
                            } else {
                                const retryErrorData = await retryResponse.json();
                                toast.error(retryErrorData.error || 'Registration failed after retry!');
                            }
                        } catch (retryError) {
                            console.error('Error during retry:', retryError);
                            toast.error('Registration failed after retry. Please try again.');
                        } finally {
                            setLoading(false); // Reset loading state
                        }
                    }, 1000); // Wait 1 second before retrying
                } else {
                    // Handle other errors normally
                    toast.error(errorData.error || 'Registration failed!');
                    setLoading(false); // Reset loading state
                }
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
                            Thank you for your interest in Inohax 2.0! Registration for this event has closed as of May 20th, 2025 at 11:59 PM.
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