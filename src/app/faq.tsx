'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
    {
        question: "What is Inohax 2.0?",
        answer: "Inohax 2.0 is a 24-hour online open innovation hackathon designed for students and entrepreneurs to collaborate, innovate, and showcase their skills. The event will be held on the 23rd and 24th of May 2025."
    },
    {
        question: "Who can participate in the hackathon?",
        answer: "Inohax 2.0 is open to students and entrepreneurs from any background. If you have a passion for problem-solving and innovation, you are welcome to join!"
    },
    {
        question: "What is the prize for the winning team?",
        answer: "The top team will win a cash prize of INR 10,000."
    },
    {
        question: "How do I register for the hackathon?",
        answer: "You can register by filling out the registration form on this page. Make sure to gather your team details and have your Inovact Social project links ready."
    },
    {
        question: "Is there a participation fee?",
        answer: "No, participation in Inohax 2.0 is completely free."
    },
    {
        question: "How many members can be in a team?",
        answer: "Teams must have between 3 and 5 members."
    },
    {
        question: "What is the format of the hackathon?",
        answer: "Inohax 2.0 is an online hackathon, so you can participate from anywhere. The event will take place over 24 hours, starting on May 23rd at 12 PM and ending on May 24th at 12 PM."
    },
    {
        question: "Do I need to use Inovact Social for the hackathon?",
        answer: "Yes, all participants must submit their project through Inovact Social. You can find a video tutorial on how to upload your project and copy your project link during registration."
    },
    {
        question: "What kind of projects can we submit?",
        answer: "You can submit projects in a variety of domains such as EdTech, HR Tech, Web3, AI, and more. Choose a domain that aligns with your team's strengths and interests."
    },
    {
        question: "How will mentorship work during the hackathon?",
        answer: "There will be two mentorship rounds during the hackathon. The first round will be at 5 PM on May 23rd, and the second will be at 9 AM on May 24th. Mentors will provide guidance and feedback on your project."
    },
    {
        question: "How will the winners be selected?",
        answer: "A panel of judges will evaluate the projects based on innovation, execution, and impact. The winner announcement will be at 3 PM on May 24th."
    },
    {
        question: "Who can I contact if I have more questions?",
        answer: (
            <>
                For any additional queries, you can contact Rishab at {" "}
                <a href="https://wa.me/919205541450" className="text-blue-500 underline">
                    +91 9205541450.
                </a>
            </>
        )
    },
    {
        question: "Will Inohax give participants problem statements to work on?",
        answer: "No, Since Inohax is an open innovation hackathon, participants are welcome to work on problem statements of their choice"
    },
    {
        question: "When is the registration deadline?",
        answer: "Registration for Inohax 2.0 closes on May 20th, 2025 at 11:59 PM. Make sure to register your team before this deadline to participate in the hackathon."
    },
    {
        question: "When do applications open?",
        answer: "Applications for Inohax 2.0 open on May 10th, 2025. You can register your team anytime between May 10th and May 20th, 2025."
    }
]

export default function FAQComponent() {
    const [openItems, setOpenItems] = useState<number[]>([])

    const toggleItem = (index: number) => {
        setOpenItems(prevOpenItems =>
            prevOpenItems.includes(index)
                ? prevOpenItems.filter(item => item !== index)
                : [...prevOpenItems, index]
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-black/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))] rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4">
                        <button
                            className="flex justify-between items-center w-full text-left focus:outline-none rounded-lg"
                            onClick={() => toggleItem(index)}
                            aria-expanded={openItems.includes(index)}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <span className="text-lg font-semibold text-gray-200">{faq.question}</span>
                            {openItems.includes(index) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems.includes(index) ? 'max-h-40' : 'max-h-0'}`}
                        >
                            {openItems.includes(index) && (
                                <p
                                    id={`faq-answer-${index}`}
                                    className="mt-2 text-gray-300"
                                >
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
