import Image from "next/image"
import CodeINBlogsLogo from "./partner-logo/CodeINBlogs.png"
import BefikraLogo from "./partner-logo/BL3.png"
import DevstationLogo from "./partner-logo/DevStation- transparent Logo.png"
import DevorldLogo from "./partner-logo/Devorld.png"
import SOSLogo from "./partner-logo/SOS.png"
const logos = [
    {
      name: 'CodeINBlogs',
      url: CodeINBlogsLogo,
    },
    {
      name: 'Befikra',
      url: BefikraLogo,
    },
    {
      name: 'Devorld',
      url: DevorldLogo,
    },
    {
      name: 'SOS',
      url: SOSLogo,
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
                    <Image
                      key={key}
                      width={50}
                      height={20}
                      src={logo.url}
                      className="h-10 w-auto px-2 brightness-0 invert"
                      alt={`${logo.name}`}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>


    )
  }

  export default PartnersLogo
