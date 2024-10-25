'use client'

import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Plus, X, User, Link, Users2, Phone, Mail, Folder } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Link from 'next/link'

interface TeamMember {
    name: string;
    socialMediaLink: string;
}

interface FormData {
    teamName: string;
    teamLeaderName: string;
    teamLeaderPhone: string;
    teamLeaderEmail: string;
    projectDomain: string;
    projectLink: string;
    teamMembers: TeamMember[];
    communityReferral: string;
}

export default function Component() {
    const { handleSubmit, control, register, reset } = useForm<FormData>();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        { name: '', socialMediaLink: '' },
        { name: '', socialMediaLink: '' },
        { name: '', socialMediaLink: '' }
    ]);
    const errorShown = useRef(new Set<string>()); // Use ref to persist error state

    const addTeamMember = () => {
        if (teamMembers.length >= 5) {
            toast.warn("Cannot add more than 5 member")
        }
        else {

            setTeamMembers([...teamMembers, { name: '', socialMediaLink: '' }])
        }
    }

    const removeTeamMember = (index: number) => {
        if (teamMembers.length > 3) {
            const updatedMembers = teamMembers.filter((_, i) => i !== index)
            setTeamMembers(updatedMembers)
        }
    }

    const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index][field] = value;
        setTeamMembers(updatedMembers);
    }

    const validateProfileLink = (value: string) => {
        const regex = /^https?:\/\/api\.inovact\.in\/v1\/user(\/.*)?(\?.*)?$/; // Updated regex to allow any path and query parameters
        return { valid: regex.test(value), message: "Inovact Social Profile Link must start with https://api.inovact.in/v1/user" };
    };

    const validateProjectLink = (value: string) => {
        const regex = /^https?:\/\/api\.inovact\.in\/v1\/post(\/.*)?(\?.*)?$/; // Updated regex to allow any path and query parameters
        return { valid: regex.test(value), message: "Inovact Social Project/Idea Link must start with https://api.inovact.in/v1/post" };
    };

    const handleValidation = (field: string, validateFunc: (value: string) => { valid: boolean; message: string }, value: string) => {
        const { valid, message } = validateFunc(value);
        if (!valid) {
            if (!errorShown.current.has(field)) {
                setTimeout(() => {
                    toast.error(message);
                    errorShown.current.add(field); // Mark this error as shown
                }, 2000); // Show error after 2 seconds
            }
        } else {
            errorShown.current.delete(field); // Clear the error if valid
        }
    };

    const onSubmit = async (data: FormData) => {
        // Removed the test toast notification
        // toast.info("Testing toast notifications!");

        // Check for required fields
        const requiredFields: (keyof FormData)[] = ['teamName', 'teamLeaderName', 'teamLeaderPhone', 'teamLeaderEmail', 'projectLink'];
        let hasError = false; // Flag to track if there are any errors
        const errorShown = new Set<string>(); // Set to track shown errors

        // Check if any required fields are empty
        for (const field of requiredFields) {
            if (!data[field as keyof FormData]) { // Use type assertion here
                hasError = true; // Set error flag
                break; // Exit loop if any required field is empty
            }
        }

        if (hasError) {
            toast.error("Please fill all the required details before submitting."); // Show toast notification
            return; // Stop submission if any required field is empty
        }

        for (const field of requiredFields) {
            if (!data[field as keyof FormData] && !errorShown.has(field)) { // Use type assertion here
                toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required.`);
                errorShown.add(field); // Mark this error as shown
                hasError = true; // Set error flag
            }
        }

        // If there are errors, stop submission
        if (hasError) {
            return; // Stop submission if any required field is empty
        }

        const payload = {
            ...data,
            teamMembers,
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
                setTeamMembers([{ name: '', socialMediaLink: '' }, { name: '', socialMediaLink: '' }, { name: '', socialMediaLink: '' }]); // Reset team members
            } else {
                toast.error('Registration failed!'); // Use toast for error message
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form. Please try again.'); // Use toast for error message
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
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
                                            <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-300">Project / Idea Details</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="projectDomain" className="text-gray-300">Project / Idea Domain *</Label>
                                        <Controller
                                            name="projectDomain"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="bg-gray-900/30 border-gray-700 text-white">
                                                        <SelectValue placeholder="Select Project / Idea Domain" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                                        <SelectItem value="edtech">EdTech</SelectItem>
                                                        <SelectItem value="hrtech">HR Tech</SelectItem>
                                                        <SelectItem value="web3">Web3</SelectItem>
                                                        <SelectItem value="FinTech"> FinTech </SelectItem>
                                                        <SelectItem value="HealthTech">HealthTech </SelectItem>
                                                        <SelectItem value="AgriTech"> AgriTech </SelectItem>
                                                        <SelectItem value="AI & Machine Learning">AI & Machine Learning </SelectItem>
                                                        <SelectItem value="ClimateTec"> ClimateTech </SelectItem>
                                                        <SelectItem value="Smart Cities">Smart Cities </SelectItem>
                                                        <SelectItem value="Cybersecurity"> Cybersecurity </SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="projectLink" className="text-gray-300">Inovact Social Project/Idea Link *</Label>
                                        <p className="text-sm text-gray-400">Please upload basic details of your project/idea on Inovact Social and paste the post link here</p>

                                        <div className="relative">
                                            <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                            <Input
                                                id="projectLink"
                                                {...register('projectLink', {
                                                    required: true,
                                                    validate: (value) => {
                                                        handleValidation('projectLink', validateProjectLink, value);
                                                        return true; // Always return true to avoid blocking submission
                                                    }
                                                })}
                                                className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                placeholder="Enter project/idea link"
                                                onBlur={(e) => handleValidation('projectLink', validateProjectLink, e.target.value)} // Validate on blur
                                            />
                                        </div>
                                        <div className="flex space-x-4"> {/* Added space-x-4 for horizontal spacing */}
                                            <a href="https://play.google.com/store/apps/details?id=in.pranaydas.inovact" target='_blank'>
                                                <Button
                                                    type="button"
                                                    className="w-fit hover:bg-[#0d2c99]/60 bg-[#0d2c99] text-white"
                                                >
                                                    Download Inovact Social
                                                </Button>
                                            </a>
                                            <a href="https://drive.google.com/file/d/1T_PpfjWKoUyOlJE5X3g9DTRUPL4xdB6o/view?usp=drivesdk" className='hidden md:block' target='_blank'>
                                                <Button
                                                    type="button"
                                                    className="w-fit hover:bg-[#0d2c99]/60 bg-[#0d2c99] text-white"
                                                >
                                                    Demo On Uploading Post On Inovact Social
                                                </Button>
                                            </a>
                                        </div>
                                        <div className="mt-4 md:hidden"> {/* New button for mobile size */}
                                            <a href="https://drive.google.com/file/d/1T_PpfjWKoUyOlJE5X3g9DTRUPL4xdB6o/view?usp=drivesdk" target='_blank'>
                                                <Button
                                                    type="button"
                                                    className="w-full hover:bg-[#0d2c99]/60 bg-[#0d2c99] text-white"
                                                >
                                                    Demo On Uploading Post On Inovact Social
                                                </Button>
                                            </a>
                                        </div>
                                        {/* New Community Referral Field */}

                                    </div>

                                </div>
                                <div className="space-y-4">
                                    <div className='flex flex-col md:flex-row justify-between'>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-300">Team Members</h3>
                                        </div>
                                        <div>
                                            <a href="https://drive.google.com/file/d/1Ahsj2IQ7F4m9xXnIyUo7T8JPDY8eVm0D/view?usp=drivesdk" target='_blank'>
                                                <Button
                                                    type="button"
                                                    className="w-fit hover:bg-[#0d2c99]/60 bg-[#0d2c99] text-white"
                                                >
                                                    Demo on Sharing Profile Link on Inovact Social
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {teamMembers.map((member, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-4"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-medium text-gray-300">Team Member {index + 1}</h4>
                                                    {index >= 3 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => removeTeamMember(index)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`memberName${index}`} className="text-gray-400">
                                                            Name {index < 3 ? '*' : ''}
                                                        </Label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                                            <Controller
                                                                name={`teamMembers.${index}.name` as const}
                                                                control={control}
                                                                defaultValue={member.name}
                                                                rules={{ required: index < 3 }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        id={`memberName${index}`}
                                                                        onChange={(e) => {
                                                                            handleTeamMemberChange(index, 'name', e.target.value);
                                                                            field.onChange(e);
                                                                        }}
                                                                        className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                                        placeholder="Enter name"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`memberLink${index}`} className="text-gray-400">
                                                            Inovact Social Profile Link {index < 3 ? '*' : ''}
                                                        </Label>
                                                        <div className="relative">
                                                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                                            <Controller
                                                                name={`teamMembers.${index}.socialMediaLink` as const}
                                                                control={control}
                                                                defaultValue={member.socialMediaLink}
                                                                rules={{ required: index < 3, validate: (value) => {
                                                                    handleValidation('memberLink' + index, validateProfileLink, value);
                                                                    return true; // Always return true to avoid blocking submission
                                                                }}}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        id={`memberLink${index}`}
                                                                        onChange={(e) => {
                                                                            handleTeamMemberChange(index, 'socialMediaLink', e.target.value);
                                                                            field.onChange(e);
                                                                        }}
                                                                        className="bg-gray-900/30 border-gray-700 text-white placeholder-gray-500 pl-10"
                                                                        placeholder="Enter Inovact Social Profile Link"
                                                                        onBlur={(e) => handleValidation('memberLink' + index, validateProfileLink, e.target.value)} // Validate on blur
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <Button
                                        type="button"
                                        onClick={addTeamMember}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Team Member
                                    </Button>
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
                        </form>
                    </CardContent>
                </Card>
            </div>
            <ToastContainer />
        </div>
    )
}
