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
      <FlyUpSection className="bg-red-400  overflow-hidden" containerHeight="h-[100vh]" triggerThreshold={0.7}>
          {/* LEFT SIDE */}
          <FlyUpImage
            imageSrc={r_l_1}
            className="w-[15vw] h-auto "
            initialOffset="100vh"
            finalOffset="-70%"
            horizontalAlign="left-[-1vw]"
            transitionDuration={0.9}
          />
          <FlyUpImage
            imageSrc={r_l_2}
            className="w-[12vw] h-auto"
            initialOffset="100vh"
            finalOffset="-9%"
            horizontalAlign="left-[-1vw]"
            transitionDuration={0.9}
          />
          <FlyUpImage
            imageSrc={r_l_3}
            className="w-[5vw] h-auto"
            initialOffset="100vh"
            finalOffset="-30vh"
            horizontalAlign="left-[14vw]"
            transitionDuration={0.9}
          />
          <FlyUpImage
            imageSrc={r_l_4}
            className="w-[15vw] h-auto"
            initialOffset="100vh"
            finalOffset="15vh"
            horizontalAlign="left-[5vw]"
            transitionDuration={0.9}
          />
          {/* Middle Section */}
          <FlyUpImage
            imageSrc={r_middle}
            className="w-[50vw] h-auto"
            initialOffset="100vh"
            finalOffset="10vh"
            horizontalAlign="left-[25vw]"
            transitionDuration={0.9}
          />
          {/* Right Section */}
          <FlyUpImage
            imageSrc={r_r_1}
            className="w-[25vw] h-auto"
            initialOffset="100vh"
            finalOffset="-18vh"
            horizontalAlign="left-[82vw]"
            transitionDuration={0.9}
          />
          <FlyUpImage
            imageSrc={r_r_2}
            className="w-[7.5vw] h-auto"
            initialOffset="100vh"
            finalOffset="-25vh"
            horizontalAlign="left-[76vw]"
            transitionDuration={0.9}
          />
          <FlyUpImage
            imageSrc={r_r_3}
            className="w-[15vw] h-auto"
            initialOffset="100vh"
            finalOffset="10vh"
            horizontalAlign="left-[85vw]"
            transitionDuration={0.9}
          />

          <LandingTitle title="Write Recipes worth Savoring..." subtitle="Share your go‑to comfort foods or secret family recipes" buttonText="Stir Up Your Story" color={"red"} />
      </FlyUpSection>
    </>
    
  )
}

export default AnimationOne