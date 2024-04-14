import { RightSidebar, Sidebar, Tweet } from "../components";
import { ArrowLeft, Search as MG } from "lucide-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const { VITE_SERVER } = import.meta.env;

const Search = () => {
    return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
                {/* Searchbar section */}
                <div className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="flex flex-col justify-center">
                        <ArrowLeft />
                    </div>
                    <label htmlFor="search" className="relative has-[:focus]:w-full hover:w-full focus:w-full w-32 transition-width duration-300 ">
                        <MG className="absolute inset-y-2.5 left-3 text-stone-400" size={20} />
                        <input
                            className=' w-full px-9 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none focus:border-primary placeholder:text-stone-400 transition-all duration-300 '
                            type="text" name="search" id="search"
                            autoFocus
                            autoComplete='false'
                            placeholder='Search People' />
                    </label>
                </div>



                {/* navigation */}
                <div className=" hidden fflex flex-wrap justify-between gap-4 px-4 font-medium border-[1px] border-x-black border-t-black border-b-stone-800">
                    <span className="border-b-4 border-b-primary rounded-b-sm p-2">Tweets</span>
                    <span className="text-stone-500 p-2">Retweets</span>
                    <span className="hidden md:inline-block text-stone-500 p-2">Replies</span>
                    <span className="text-stone-500 p-2">Likes</span>
                </div>

                {/* Search results */}

                <div className="flex gap-8 justify-between px-4 py-4 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="flex gap-6">
                        <img className="h-14 w-14 rounded-full object-cover" src="https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/k3inrajwwhjzwvmcq1hd.jpg" alt="" />
                        <div className="flex flex-col self-center">
                            <h3 className="font-medium">Elon Musk</h3>
                            <p className="text-stone-500">@elon.musk</p>
                        </div>
                    </div>
                    <div className="self-center">
                        <button className="border border-stone-700 px-6 py-1.5 pt-2 rounded-full text-sm bg-stone-200 text-black">
                            Follow
                        </button>
                    </div>
                </div>


                {/* Tweets section */}
                {/* <Tweet /> */}

            </div>

            {/* <RightSidebar /> */}
        </main>
    )
}

export default Search
