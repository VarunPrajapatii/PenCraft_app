import g_l_1 from '/images/green/g-l-1.png'
import g_l_2 from '/images/green/g-l-2.png'
import g_l_3 from '/images/green/g-l-3.png'
import g_l_4 from '/images/green/g-l-4.png'
import g_r_1 from '/images/green/g-r-1.png'
import g_r_2 from '/images/green/g-r-2.png'
import g_r_3 from '/images/green/g-r-3.png'
import g_middle from '/images/green/g-middle.png'
import { FlyUpImage } from "./FlyUpImage";
import { FlyUpSection } from "./FlyUpSection";
import LandingTitle from './LandingTitle'


const AnimateThree = () => {
  return (
    <>
      <FlyUpSection className="bg-emerald-500/80 dark:bg-emerald-800 w-[100vw] overflow-hidden" containerHeight="h-[120vh]" triggerThreshold={0.7}>
        {/* LEFT SIDE */}
        <FlyUpImage
          imageSrc={g_l_1}
          className="w-[38vw] md:w-[25vw] lg:w-[18vw] h-auto "
          initialOffset="100vh"
          finalOffset="-70%"
          horizontalAlign="left-[-4vw] lg:left-[-5vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={g_l_2}
          className="w-[30vw] md:w-[20vw] lg:w-[15vw] h-auto"
          initialOffset="100vh"
          finalOffset="4%"
          horizontalAlign="left-[-4vw] lg:left-[-2vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={g_l_3}
          className="w-[15vw] md:w-[10vw] lg:w-[12vw] h-auto"
          initialOffset="100vh"
          finalOffset="-30vh"
          horizontalAlign="left-[1vw] md:left-[-2vw] lg:left-[14vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={g_l_4}
          className="w-[35vw] md:w-[23vw] lg:w-[13vw] h-auto"
          initialOffset="100vh"
          finalOffset="5vh"
          horizontalAlign="left-[-2vw] md:left-[0vw] lg:left-[12vw]"
          transitionDuration={0.9}
        />
        {/* Middle Section */}
        <FlyUpImage
          imageSrc={g_middle}
          className="z-1 w-[80vw] sm:w-[50vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign="bottom-10 lg:bottom-0 left-[25vw]"
          transitionDuration={0.9}
        />
        {/* Right Section */}
        <FlyUpImage
          imageSrc={g_r_1}
          className="w-[30vw] sm:w-[20vw] lg:w-[15vw] h-auto"
          initialOffset="100vh"
          finalOffset="-18vh"
          horizontalAlign=" left-[70vw] lg:left-[90vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={g_r_2}
          className=" w-[20vw] lg:w-[15vw] h-auto"
          initialOffset="100vh"
          finalOffset="-30vh"
          horizontalAlign=" left-[45vw] lg:left-[72vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={g_r_3}
          className="bottom-30 sm:bottom-0 w-[35vw] sm:w-[35vw] lg:w-[18vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign=" left-[50vw] sm:left-[75vw] md:left-[78vw]"
          transitionDuration={0.9}
        />

        <LandingTitle title="Publish your passions, your adventures, your way..." subtitle="Create a unique and beautiful blog easily." buttonText="Create blog, Get Started!" color={"green"} />
      </FlyUpSection>
    </>

  )
}

export default AnimateThree