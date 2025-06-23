import b_l_1 from '../../../images/blue/b-l-1.png'
import b_l_2 from '../../../images/blue/b-l-2.png'
import b_l_3 from '../../../images/blue/b-l-3.png'
import b_r_1 from '../../../images/blue/b-r-1.png'
import b_r_2 from '../../../images/blue/b-r-2.png'
import b_r_3 from '../../../images/blue/b-r-3.png'
import b_middle from '../../../images/blue/b-middle.png'
import { FlyUpSection } from './FlyUpSection'
import { FlyUpImage } from './FlyUpImage'
import LandingTitle from './LandingTitle'

const AnimationTwo = () => {
  return (
    <div>
      <FlyUpSection className="bg-blue-400  overflow-hidden" containerHeight="h-[110vh]" triggerThreshold={0.7}>
        {/* LEFT SIDE */}
        <FlyUpImage
          imageSrc={b_l_1}
          className="w-[45vw] sm:w-[33vw] lg:w-[15vw] h-auto "
          initialOffset="100vh"
          finalOffset="-90%"
          horizontalAlign="left-[-5vw] md:left-[-4vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={b_l_2}
          className="w-[45vw] sm:w-[33vw] lg:w-[15vw] h-auto "
          initialOffset="100vh"
          finalOffset="35%"
          horizontalAlign="left-[-15vw] lg:left-[-4vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={b_l_3}
          className="hidden md:block md:w-20  lg:w-[8vw] h-auto"
          initialOffset="100vh"
          finalOffset="-10vh"
          horizontalAlign="left-[14vw]"
          transitionDuration={0.9}
        />
        {/* Middle Section */}
        <FlyUpImage
          imageSrc={b_middle}
          className="z-1 w-[85vw] sm:w-[60vw] lg:w-[50vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign="bottom-10 md:bottom-0 left-25 sm:left-30 lg:left-[25vw]"
          transitionDuration={0.9}
        />
        {/* Right Section */}
        <FlyUpImage
          imageSrc={b_r_1}
          className="w-[50vw] md:w-[35vw]  lg:w-[25vw] h-auto"
          initialOffset="100vh"
          finalOffset="-18vh"
          horizontalAlign="left-[65vw] md:left-[75vw] lg:left-[82vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={b_r_2}
          className="w-20 md:w-30 lg:w-[7.5vw] h-auto"
          initialOffset="100vh"
          finalOffset="-25vh"
          horizontalAlign="left-45 md:left-130 lg:left-[76vw]"
          transitionDuration={0.9}
        />
        <FlyUpImage
          imageSrc={b_r_3}
          className="w-40 sm:w-55 lg:w-[15vw] h-auto"
          initialOffset="100vh"
          finalOffset="10vh"
          horizontalAlign="bottom-25 sm:bottom-10 lg:bottom-0 left-50 sm:left-140 lg:left-[80vw]"
          transitionDuration={0.9}
        />
        <LandingTitle title="Inspire fellow explorers with your travel..." subtitle="Share your greatest travel stories, tips, and experiences with the world." buttonText="Tell Tales from the Road" color={"blue"} />
      </FlyUpSection>
    </div>
  )
}

export default AnimationTwo