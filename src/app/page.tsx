import Hero from "@/components/sections/hero";
import Benefits from "@/components/sections/benefits";
import Hackathon from "@/components/sections/hackathon";
import Footer from "@/components/sections/footer";
import MentorJurySection from "@/components/sections/mentorjury";
import FAQComponent from "./faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Hackathon/>
      <MentorJurySection/>
      <FAQComponent/>
      <Footer/>
    </>
  );
}
