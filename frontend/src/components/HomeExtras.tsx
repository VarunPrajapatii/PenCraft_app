import React from "react";
import { Avatar } from "./BlogCard";
import { blogs } from "../pages/BlogsFE";

const HomeExtras = () => {
  return (
    <>
        <div className="pl-10">
            <div className="pt-10 font-semibold">Top Picks</div>
            <SmallCard name="varun" title="ajdfh aksjdfaj shdgl asf galdf gjahfkg hakljf glakjfh gkjlafkjg skldjf bgklsd fgl sdkjf bglskjdf g" />
            <SmallCard name="swechha" title="ajdfh aksjdfaj shdgl asf galdf gjahfkg hakljf glakjfh gkjlafkjg skldjf bgklsd fgl sdkjf bglskjdf g" />
            <SmallCard name="shreya" title="ajdfh aksjdfaj shdgl asf galdf gjahfkg hakljf glakjfh gkjlafkjg skldjf bgklsd fgl sdkjf bglskjdf g" />
        </div>
        <div className="pl-10 pt-12">
            <div className=" font-semibold">People</div>
        </div>
    </>
  );
};

interface SmallCardProps {
    name: string,
    title: string,
}
export function SmallCard({name, title }: SmallCardProps) {
  return (
    <div>
      <div className="pt-6 flex items-center">
        <Avatar name={name} size="big" />
        <div className="pl-2 pt-2  text-lg">{name}</div>
      </div>
      <div className="font-bold text-lg">
        {title.length >= 50 ? title.slice(0,30) + "..." : title}
      </div>
    </div>
  );
}

export default HomeExtras;
