import { RightSidebar, Sidebar, Tweet } from "../components";
import { ArrowLeft, BadgeCheck, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";

const { VITE_SERVER } = import.meta.env;
const Profile = () => {
    const navigate = useNavigate();
    return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
                {/* Topbar section */}
                <div className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="cursor-pointer">
                        <ArrowLeft onClick={() => navigate(-1, {replace: true})} />
                    </div>
                    <div className="font-medium">Elon Musk</div>
                </div>

                {/* Cover and Profile Picture */}
                <div className="relative">
                    <img className="h-28 md:h-52 w-full object-cover" src="https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/d2rofpwtn3x4y5altned.jpg" alt="cover" />
                    <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 hover:opacity-35 transition-all"></div>
                    <div className="absolute translate-x-4 -translate-y-1/2">
                        <img className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black object-cover" src="https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/k3inrajwwhjzwvmcq1hd.jpg" alt="Profile Pic" />
                    </div>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-2 m-4">
                    <div className="text-right text-sm font-semibold">
                        <button className="border border-stone-700 px-4 pb-1 pt-1 rounded-full hover:border-stone-500 transition-all">
                            Edit Profile
                        </button>
                    </div>
                    <div className="md:mt-4">
                        <h3 className="text-lg font-bold">
                            Elon Musk <BadgeCheck className="inline-block ml-1 self-center text-black bg-yellow-500 rounded-full" size={16} />
                        </h3>
                        <p className="text-stone-500">
                            @elon.musk
                        </p>
                    </div>
                    <div className="my-1 text-sm md:text-base">
                        I buy things for fun.
                    </div>
                    <div className="flex align-middle gap-2 text-sm md:text-base text-stone-500">
                        <CalendarDays size={18}/> <span>Joined January 2022</span>
                    </div>
                    <div className="flex gap-4 text-sm md:text-base">
                        <a>
                            0 <span className="text-stone-500">Following</span>
                        </a>
                        <a>
                            0 <span className="text-stone-500">Followers</span>
                        </a>
                    </div>
                </div>

                {/* navigation */}
                <div className="flex flex-wrap justify-between gap-4 px-4 font-medium border-[1px] border-x-black border-t-black border-b-stone-800">
                    <span className="border-b-4 border-b-primary rounded-b-sm p-2">Tweets</span>
                    <span className="text-stone-500 p-2">Retweets</span>
                    <span className="hidden md:inline-block text-stone-500 p-2">Replies</span>
                    <span className="text-stone-500 p-2">Likes</span>
                </div>


                {/* Tweets section */}
                <Tweet />
                <Tweet />

            </div>

            <RightSidebar/>
        </main>
    )
}

export default Profile
