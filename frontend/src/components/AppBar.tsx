
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./blogsHomePage/BlogCard";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";

export const AppBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signOut = () => {
        dispatch(logout());
        navigate("/signin")
    }

    const name = useSelector((store: RootState) => store.loggedInUserDetails?.name || "Anyonymous");
    const email = useSelector((store: RootState) => store.loggedInUserDetails?.email);

    return (
        <nav className="bg-white border-b border-gray-200 ">
            <div className="px-3 py-1 mx-10 my-2">
                <div className="flex justify-between items-center">
                    <Link to={"/blogs"}>
                        <span className="text-gray-800 text-3xl font-bold">PenCraft</span>
                    </Link>

                    <div className="flex items-center">
                        <Link to="/publish">
                            <button
                                type="button"
                                className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg px-4 py-2 mr-4"
                            >
                                Create Post
                            </button>
                        </Link>

                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative">
                            <div>
                                <MenuButton className="flex rounded-full focus:outline-none items-center">
                                    <Avatar name={name} size={"big"} />
                                    <div className="text-gray-800 font-semibold ml-2 text-xl">
                                        <div>Hi, {name}</div>
                                    </div>
                                </MenuButton>
                            </div>
                            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg border border-gray-200">
                                <MenuItem>
                                    <Link
                                        to={`/@${email?.split('@')[0]}`}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                                        onClick={signOut}
                                    >
                                        Signout
                                    </button>
                                </MenuItem>

                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
