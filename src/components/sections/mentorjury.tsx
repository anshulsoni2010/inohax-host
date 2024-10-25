'use client'

import { useState } from "react"
import Image from "next/image"
import { Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import jury1 from "../../app/assets/jury1.jpg";
import jury2 from "../../app/assets/jury2.jpeg";
import jury3 from "../../app/assets/jury3.png";
import jury4 from "../../app/assets/jury4.png";
import jury5 from "../../app/assets/jury5.png";
import ment1 from "../../app/assets/ment1.png";
import ment2 from "../../app/assets/ment2.png";
import ment3 from "../../app/assets/ment3.jpg";
export default function MentorJurySection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const mentors = [
        {
            name: "Sarang Pani",
            designation: "Founder, Inovact",
            image: jury5,
            linkedin: "https://www.linkedin.com/in/sarang-pani-14ab1919b/"
        },
        {
            name: "Chandrakanth",
            designation: "Head of Programs & Partnerships, SJCE STEP",
            image: jury1,
            linkedin: "https://www.linkedin.com/in/chandrakanth-ck"
        },
        {
            name: "Yuvraj Aaditya Arya",
            designation: "Founder, Webkites",
            image: jury2,
            linkedin: "https://www.linkedin.com/in/aadityayuvraj"
        },
        {
            name: "Ayush Pandey",
            designation: "Founder, Skillvalley",
            image: jury3,
            linkedin: "https://www.linkedin.com/in/ayushpm21"
        },
        {
            name: "Akshay Ramesh",
            designation: "Founder, Doctrue",
            image: jury4,
            linkedin: "https://www.linkedin.com/in/akshayrameshh/"
        },

    ]

    const juryMembers = [
        {
            name: "Tarun Bajaj",
            designation: "Founder, Upciti",
            image: ment1,
            linkedin: "https://www.linkedin.com/in/tarun--bajaj/"
        },
        {
            name: "Chandan",
            designation: "Software Engineer - Commvault",
            image: ment2,
            linkedin: "https://www.linkedin.com/in/chandan-s-gowda/"
        },
        {
            name: "Vaishakh",
            designation: "Founder, Frelo",
            image: ment3,
            linkedin: "https://www.linkedin.com/in/vaishakhsajeevan/"
        },
    ]


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    }

    return (
        <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="relative bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 mb-16 shadow-2xl shadow-purple-900/20">
                    <section className="mb-24">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl font-semibold text-center mb-12 text-blue-300"
                        >
                            Mentors
                        </motion.h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative flex flex-wrap justify-center items-center max-w-4xl mx-auto"
                        >
                            <div className="w-full flex md:flex-row flex-col justify-center mb-4">
                                {mentors.slice(0, 3).map((mentor, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="flex flex-col items-center  md:w-[800px] mb-6 p-8" // Increased width and max-width
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <div className="relative w-full pb-[100%] mb-4">
                                            <div className="absolute inset-0">
                                                <Image
                                                    src={mentor.image}
                                                    alt={mentor.name}
                                                   fill
                                                    className="rounded-full object-cover"
                                                />
                                                <motion.div
                                                    initial={false}
                                                    animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1 text-center">{mentor.name}</h3>
                                        <p className="text-sm text-blue-300 mb-2 text-center">{mentor.designation}</p>
                                        <motion.a
                                            href="#"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
   <span className="sr-only">LinkedIn profile of {mentor.name}</span>
                                        </motion.a>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="w-full flex md:flex-row flex-col justify-center mt-[-40px]">
                                {mentors.slice(3, 5).map((mentor, index) => (
                                    <motion.div
                                        key={index + 3}
                                        variants={itemVariants}
                                        className="flex flex-col items-center md:w-[300px] mb-6 p-8" // Increased width and max-width
                                        onMouseEnter={() => setHoveredIndex(index + 3)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <div className="relative w-full pb-[100%] mb-4">
                                            <div className="absolute inset-0">
                                                <Image
                                                    src={mentor.image}
                                                    alt={mentor.name}
                                                   fill
                                                    className="rounded-full object-cover"
                                                />
                                                <motion.div
                                                    initial={false}
                                                    animate={{ scale: hoveredIndex === index + 3 ? 1.1 : 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1 text-center">{mentor.name}</h3>
                                        <p className="text-sm text-blue-300 mb-2 text-center">{mentor.designation}</p>
                                        <motion.a
                                            href="#"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                            <span className="sr-only">LinkedIn profile of {mentor.name}</span>
                                        </motion.a>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>


                    <section>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-4xl font-semibold text-center mb-12 text-purple-300"
                        >
                            Jury Members
                        </motion.h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center"
                        >
                            {juryMembers.map((juryMember, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex flex-col items-center mb-6 p-8" // Consistent spacing
                                    onMouseEnter={() => setHoveredIndex(index + mentors.length)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="relative w-56 h-56 mb-6">
                                        <Image
                                            src={juryMember.image}
                                            alt={juryMember.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                        <motion.div
                                            initial={false}
                                            animate={{ scale: hoveredIndex === index + mentors.length ? 1.1 : 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"
                                        />
                                    </div>
                                    <h3 className="text-3xl font-semibold mb-2">{juryMember.name}</h3>
                                    <p className="text-purple-300 mb-4">{juryMember.designation}</p>
                                    <motion.a
                                        href={juryMember.linkedin} // Using the LinkedIn URL from the data
                                        target="_blank" // Opens in a new tab
                                        rel="noopener noreferrer" // Security attributes
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                        <span className="sr-only">LinkedIn profile of {juryMember.name}</span>
                                    </motion.a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                </div>
            </div>
        </div>
    )
}
