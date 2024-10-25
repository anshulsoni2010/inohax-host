import Image from "next/image"
import BefikraCommunityLogo from "./partner-logo/1._Befikra_Community-removebg-preview-modified.png"
import BlockpenLogo from "./partner-logo/2._Blockpen-removebg-preview-modified.png"
import AssamUniversityLogo from "./partner-logo/3._Assam_University_IT_club-removebg-preview-modified.png"
import CodeClubJULogo from "./partner-logo/4._CodeClub_JU-removebg-preview-modified.png"
import BTechyLogo from "./partner-logo/5._BTechy-removebg-preview-modified.png"
import SOSLogo from "./partner-logo/7._SOS_TECH-removebg-preview-modified.png"
import BitsOnlineLogo from "./partner-logo/8._BITS_online_Entrepreneurship_Club-removebg-preview-modified.png"
import DevBoardLogo from "./partner-logo/9.1_DevBoard-removebg-preview-modified.png"
import CodingBitsLogo from "./partner-logo/10._Coding_Bits-removebg-preview-modified.png"
import DevCodeCommunityLogo from "./partner-logo/11._Dev_Code_Community-removebg-preview-modified.png"
import SerenityLCLogo from "./partner-logo/12._Serenity_LC__Life_Community_for_Wellness-removebg-preview-modified.png"
import CatsInTechLogo from "./partner-logo/13.1_Cats_In_Tech-removebg-preview-modified.png";
import HackCultureLogo from "./partner-logo/WhatsApp_Image_2024-10-25_at_13.13.38_8f5203c9-removebg-preview.png"
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
        name: 'Serenity LC',
        url: SerenityLCLogo,
    },
    {
        name: 'Cats In Tech',
        url: CatsInTechLogo,
    },
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
                                            className="h-full aspect-auto px-2"
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
