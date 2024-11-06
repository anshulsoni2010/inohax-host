import Image from "next/image"
import CodeINBlogsLogo from "./partner-logo/6.png"
import BefikraCommunityLogo from "./partner-logo/1.png"
import BlockpenLogo from "./partner-logo/2.png"
import AssamUniversityLogo from "./partner-logo/3.png"
import CodeClubJULogo from "./partner-logo/4.png"
import BTechyLogo from "./partner-logo/5.png"
import SOSLogo from "./partner-logo/7.png"
import BitsOnlineLogo from "./partner-logo/8.png"
import DevBoardLogo from "./partner-logo/13.png"
import CodingBitsLogo from "./partner-logo/10.png"
import DevCodeCommunityLogo from "./partner-logo/11.png"
import CatsInTechLogo from "./partner-logo/13.1_Cats_In_Tech-removebg-preview-modified.png";
import HackCultureLogo from "./partner-logo/hackculture.png";
import codeo from "./partner-logo/9.png";
import ALogo from "./partner-logo/A.jpg"
import Blogo from "./partner-logo/B.jpg"
import CLogo from "./partner-logo/C.jpg"
import DLogo from "./partner-logo/D.jpg"
import ELogo from  "./partner-logo/E.jpg"
import FLogo from "./partner-logo/F.png"
import GLogo from "./partner-logo/G.png"


const logos = [
    {
        name: 'Befikra Community',
        url: BefikraCommunityLogo,
    },

    {
        name: 'Blockpen',
        url: BlockpenLogo,
    },
    {
        name: 'Assam University IT Club',
        url: AssamUniversityLogo,
    },
    {
        name: 'CodeINBlogs',
        url: CodeINBlogsLogo,
    },
    {
        name: 'CodeClub JU',
        url: CodeClubJULogo,
    },
    {
        name: 'BTechy',
        url: BTechyLogo,
    },

    {
        name: 'SOS TECH',
        url: SOSLogo,
    },
    {
        name: 'HackCultureLogo',
        url: HackCultureLogo,
    },
    {
        name: 'BITS Online Entrepreneurship Club',
        url: BitsOnlineLogo,
    },
    {
        name: 'DevBoard',
        url: DevBoardLogo,
    },
    {
        name: 'Coding Bits',
        url: CodingBitsLogo,
    },
    {
        name: 'Dev Code Community',
        url: DevCodeCommunityLogo,
    },
    {
        name: 'codeNight',
        url: codeo,
    },
    {
        name: 'Cats In Tech',
        url: CatsInTechLogo,
    },
    {
        name: 'ALogo',
        url: ALogo,
    },
    {
        name: 'BLogo',
        url: Blogo,
    },
    {
        name: 'CLogo',
        url: CLogo,
    },
    {
        name: 'DLogo',
        url: DLogo,
    },
    {
        name: 'ELogo',
        url: ELogo,
    },
    {
        name: 'FLogo',
        url: FLogo,
    },
    {
        name: 'GLogo',
        url: GLogo,
    }
]

const PartnersLogo = () => {
    return (
        <div className="w-full px-6">
            <h3 className="text-gray-200 mb-8 text-3xl font-semibold sm:text-4xl font-geist tracking-tighter text-center">
                Community Partners
            </h3>
            <div className="mx-auto w-full mt-12">
                <div
                    className="group relative flex gap-6 overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
                    }}
                >
                    {Array(5)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                            >
                                {logos.map((logo, key) => (
                                    <div
                                        key={key}
                                        className="mx-4"
                                    >
                                        <Image

                                            src={logo.url}
                                            className="h-16 w-full px-2"
                                            alt={`${logo.name}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
            </div>
        </div>


    )
}

export default PartnersLogo
