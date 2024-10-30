'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

interface FormData {
    teamName: string;
    teamLeaderName: string;
    teamLeaderPhone: string;
    teamLeaderEmail: string;
    projectTitle: string;
    projectDescription: string;
    relatedLink: string;
    communityReferral: string;
    projectDomain: string; // Added projectDomain to FormData
}

export default function Component() {
    const { handleSubmit, control, register, reset } = useForm<FormData>();
    const [loading, setLoading] = useState(false); // State for loading

    const onSubmit = async (data: FormData) => {
        setLoading(true); // Set loading to true when submission starts

        const requiredFields: (keyof FormData)[] = [
            'teamName',
            'teamLeaderName',
            'teamLeaderPhone',
            'teamLeaderEmail',
            'projectTitle',
            'projectDescription',
            'projectDomain', // Added projectDomain to required fields
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

    return (
        <>
            <Head>
                <link rel="icon" href="/inovact.png" />
                <title>Inohax 1.0 Registration Form</title>
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
                                Inohax 1.0 Registration
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
                                        <Label htmlFor="projectDomain" className="text-gray-300">Project Domain *</Label>
                                        <Controller
                                            name="projectDomain"
                                            control={control}
                                            rules={{ required: true }} // Make this field required
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="bg-gray-900/30 border-gray-700 text-white">
                                                        <SelectValue placeholder="Select Project Domain" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                                        <SelectItem value="edtech">EdTech</SelectItem>
                                                        <SelectItem value="hrtech">HR Tech</SelectItem>
                                                        <SelectItem value="web3">Web3</SelectItem>
                                                        <SelectItem value="fintech">FinTech</SelectItem>
                                                        <SelectItem value="healthtech">HealthTech</SelectItem>
                                                        <SelectItem value="agritech">AgriTech</SelectItem>
                                                        <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                                                        <SelectItem value="climatetech">ClimateTech</SelectItem>
                                                        <SelectItem value="smart_cities">Smart Cities</SelectItem>
                                                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="projectTitle" className="text-gray-300">Project Title *</Label>
                                        <Input
                                            id="projectTitle"
                                            {...register('projectTitle', { required: true })}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500"
                                            placeholder="Enter project title"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="projectDescription" className="text-gray-300">Project Description *</Label>
                                        <textarea
                                            id="projectDescription"
                                            {...register('projectDescription', { required: true })}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 w-full h-24"
                                            placeholder="Enter project description"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="relatedLink" className="text-gray-300">Related Link (If any)</Label>
                                        <Input
                                            id="relatedLink"
                                            {...register('relatedLink')}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500"
                                            placeholder="Insert any link"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-300">Community Referral</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="communityReferral" className="text-gray-300">Referred by (Optional)</Label>
                                        <Input
                                            id="communityReferral"
                                            {...register('communityReferral')}
                                            className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                            placeholder="Enter community referral name or code"
                                        />
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
