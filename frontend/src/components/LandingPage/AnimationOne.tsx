import r_l_1 from '../../../images/red/r-l-1.png'
import r_l_2 from '../../../images/red/r-l-2.png'
import r_l_3 from '../../../images/red/r-l-3.png'
import r_l_4 from '../../../images/red/r-l-4.png'
import r_r_1 from '../../../images/red/r-r-1.png'
import r_r_2 from '../../../images/red/r-r-2.png'
import r_r_3 from '../../../images/red/r-r-3.png'
import r_middle from '../../../images/red/r-middle.png'
import { FlyUpImage } from "./FlyUpImage";
import { FlyUpSection } from "./FlyUpSection";
import LandingTitle from './LandingTitle'


const AnimationOne = () => {
  return (
    <>
      <FlyUpSection className="bg-red-400 w-[100vw] overflow-hidden" containerHeight="h-[100vh]" triggerThreshold={0.7}>
        {/* LEFT SIDE */}
        <FlyUpImage
          imageSrc={r_l_1}
          className="w-[38vw] md:w-[25vw] lg:w-[15vw] h-auto "
          initialOffset="100vh"
          finalOffset="-70%"
          horizontalAlign="left-[-4vw] lg:left-[-1vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={r_l_2}
          className="w-[30vw] md:w-[20vw] lg:w-[12vw] h-auto"
          initialOffset="100vh"
          finalOffset="-9%"
          horizontalAlign="left-[-4vw] lg:left-[-1vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={r_l_3}
          className="w-[15vw] md:w-[10vw] lg:w-[5vw] h-auto"
          initialOffset="100vh"
          finalOffset="-30vh"
          horizontalAlign="left-[1vw] md:left-[-2vw] lg:left-[14vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={r_l_4}
          className="w-[35vw] md:w-[23vw] lg:w-[17vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign="left-[-2vw] md:left-[0vw] lg:left-[5vw]"
          transitionDuration={0.9}
        />
        {/* Middle Section */}
        <FlyUpImage
          imageSrc={r_middle}
          className="z-1 w-[80vw] sm:w-[50vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign="bottom-10 lg:bottom-0 left-[25vw]"
          transitionDuration={0.9}
        />
        {/* Right Section */}
        <FlyUpImage
          imageSrc={r_r_1}
          className="w-[50vw] sm:w-[40vw] lg:w-[25vw] h-auto"
          initialOffset="100vh"
          finalOffset="-18vh"
          horizontalAlign=" left-[70vw] lg:left-[82vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={r_r_2}
          className=" w-[20vw] lg:w-[7.5vw] h-auto"
          initialOffset="100vh"
          finalOffset="-25vh"
          horizontalAlign=" left-[45vw] lg:left-[76vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={r_r_3}
          className="bottom-30 sm:bottom-0 w-[35vw] sm:w-[35vw] lg:w-[15vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign=" left-[50vw] sm:left-[75vw] md:left-[85vw]"
          transitionDuration={0.9}
        />

        <LandingTitle title="Write Recipes worth Savoring..." subtitle="Share your go‑to comfort foods or secret family recipes" buttonText="Stir Up Your Story" color={"red"} />
      </FlyUpSection>
    </>

  )
}

export default AnimationOne