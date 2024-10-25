import Hero from "@/components/sections/hero";
import Benefits from "@/components/sections/benefits";
import Hackathon from "@/components/sections/hackathon";
import Footer from "@/components/sections/footer";
import MentorJurySection from "@/components/sections/mentorjury";
import FAQComponent from "./faq";
import Head from "next/head";
export default function Home() {
  return (
    <>
    <Head>
      <title>Inohax 1.0</title>
    </Head>
      <Hero />
      <Benefits />
      <Hackathon/>
      <MentorJurySection/>
      <FAQComponent/>
      <Footer/>
    </>
  );
}
