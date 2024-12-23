import { Avatar } from "../blogsHomePage/BlogCard"

const UserFollowers = () => {
  return (
    <div>
            <div className="">
              <div className="text-md font-light mt-[8%]">
                Varun Prajapati {">"} Followers
              </div>
              <div className="text-5xl font-bold pt-4">
                10 Followers
              </div>
              <div className="pt-5">
                <UserCard />
              </div>
            </div>
          </div>
  )
}

export default UserFollowers

const UserCard = () => {
  return (
    <div className="flex py-2">
      <div className="mr-5">
        <Avatar size="big" name="Varun" />
      </div>
      <div>
        <div className="text-lg font-semibold">
          Varun Prajapati
        </div>
        <div>
          User bio that contains things that describe the user. And it can be long or short.
        </div>
      </div>
    </div>
  )
}