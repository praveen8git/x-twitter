import axios from "axios";
import { RightSidebar, Sidebar, Tweet } from "../components";
import { ArrowLeft, BadgeCheck, Search as MG } from "lucide-react";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const Search = () => {
    const { user: loggedUser } = useContext(IsAuthenticatedContext);
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);

    const [query, setQuery] = useState('');

    const handleSearch = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${VITE_SERVER}/api/search/${query}`, {
                withCredentials: true,
            });
            // Update the userProfile state to reflect the new follow status
            console.log(response.data, 'search');
            setUsers(response.data);
        } catch (error) {
            console.error("search:", error);
            toast.error("Failed to search");
        }
    }

    const toggleFollow = async (username) => {
        try {
            const response = await axios.patch(`${VITE_SERVER}/api/follow/${username}`, {}, {
                withCredentials: true,
            });
            // Update the userProfile state to reflect the new follow status
            console.log(response.data, 'toggle follow');
            setUsers(prev => prev.filter(user => user.username !== username));
            toast.success("Unfollowed");
        } catch (error) {
            console.error("Failed to toggle follow:", error);
            toast.error("Failed to toggle follow");
        }
    };  


    return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black">
                {/* Searchbar section */}
                <form onSubmit={handleSearch} className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="flex flex-col justify-center cursor-pointer">
                        <ArrowLeft onClick={() => navigate(-1, { replace: true })} />
                    </div>
                    <label htmlFor="search" className="relative has-[:focus]:w-full hover:w-full focus:w-full w-32 transition-width duration-300 ">
                        <MG className="absolute inset-y-2.5 left-3 text-stone-400" size={20} />
                        <input
                            className=' w-full px-9 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none focus:border-primary placeholder:text-stone-400 transition-all duration-300 '
                            type="text" name="search" id="search"
                            autoFocus
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete='false'
                            placeholder='Search People' />
                    </label>
                    <button type="submit" className="hidden"></button>
                </form>



                {/* navigation */}
                <div className=" hidden fflex flex-wrap justify-between gap-4 px-4 font-medium border-[1px] border-x-black border-t-black border-b-stone-800">
                    <span className="border-b-4 border-b-primary rounded-b-sm p-2">Tweets</span>
                    <span className="text-stone-500 p-2">Retweets</span>
                    <span className="hidden md:inline-block text-stone-500 p-2">Replies</span>
                    <span className="text-stone-500 p-2">Likes</span>
                </div>

                {/* Search results */}

                {
                    users.length > 0 ? (
                        users.map(user => (
                            <Link to={'/profile/'+ user.username} key={user._id} className="flex gap-8 justify-between px-4 md:px-12 py-4 border-[1px] border-x-black border-t-black border-b-stone-800">
                                <div className="flex gap-6">
                                    <img className="h-14 w-14 rounded-full object-cover" src={
                                        user?.profilePicture === "" ?
                                            "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                                            : user.profilePicture
                                    } alt="DP" />
                                    <div className="flex flex-col self-center">
                                        <h3 className="font-medium">{user.fullName} <BadgeCheck className={`inline-block ml-1 self-center text-black ${user.subscription == "Premium" ? 'bg-primary' : 'bg-yellow-500'} rounded-full`} size={16} /></h3>
                                        <p className="text-stone-500">@{user.username}</p>
                                    </div>
                                </div>
                                <div className="self-center">
                                    
                                    <button onClick={() => {toggleFollow(user.username)}} className="font-semibold border border-stone-700 px-6 py-1.5 pt-2 rounded-full text-sm bg-stone-200 text-black">
                                        {   
                                            user.followers && loggedUser && user.followers.includes(loggedUser._id) ? 'Following' : 'Follow'
                                        }
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center w-full my-6">No Results...</div>
                    )

                }


                {/* Tweets section */}
                {/* <Tweet /> */}

            </div>

            <RightSidebar />
        </main>
    )
}

export default Search
