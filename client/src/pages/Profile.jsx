import { RightSidebar, Sidebar, Tweet } from "../components";
import { ArrowLeft, BadgeCheck, CalendarDays } from "lucide-react";
import { Link, useNavigate, useParams, NavLink } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const Profile = () => {
    const { login, user } = useContext(IsAuthenticatedContext);

    const navigate = useNavigate();
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${VITE_SERVER}/api/profile/${username}`, {
                withCredentials: true,
            });
            console.log('userProfile',response.data);
            setUserProfile(response.data);
            setFollowersCount(response.data.followers.length)
            setActiveTab('tweets')
            setTweetsData(response.data.tweets);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [username]);

    const [tweetsData, setTweetsData] = useState([]);
    const [activeTab, setActiveTab] = useState('tweets')

    const filterTweets = (type) => {
        setActiveTab(type);
        setTweetsData(
            userProfile[type]
        )
    }

    // Delete handler for tweets
    const deleteTweetFromProfile = (tweetId) => {
        setTweetsData(tweetsData.filter(tweet => tweet._id !== tweetId));
    };

    const [followersCount, setFollowersCount] = useState(userProfile?.followers.length)
    const toggleFollow = async () => {
        try {
            const response = await axios.patch(`${VITE_SERVER}/api/follow/${userProfile.username}`, {}, {
                withCredentials: true,
            });
            // Update the userProfile state to reflect the new follow status
            console.log(response.data, 'toggle follow');
            setUserProfile({ ...userProfile, isFollowing: !userProfile.isFollowing });
            setFollowersCount(response.data.followers.length)
            toast.success(userProfile.isFollowing ? "Unfollowed" : "Followed");
        } catch (error) {
            console.error("Failed to toggle follow:", error);
            toast.error("Failed to toggle follow");
        }
    };   

    // useEffect(() => {
    //     console.log(tweetsData);
    // }, [tweetsData])

    if (loading) {
        return <div className="w-screen h-screen text-center py-[20%] bg-black animate-pulse">Loading...</div>;
    }

    if (user !== null) return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
                {/* Topbar section */}
                <div className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="cursor-pointer">
                        <ArrowLeft onClick={() => navigate(-1, { replace: true })} />
                    </div>
                    <div className="font-medium">{userProfile.fullName}</div>
                </div>

                {/* Cover and Profile Picture */}
                <div className="relative">
                    <img className="h-28 md:h-52 w-full object-cover" src={userProfile.coverPicture || "https://imgtr.ee/images/2024/04/15/b1b16031d7f4176b5093cff05dfa0be4.png"} alt="cover" />
                    <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 hover:opacity-35 transition-all"></div>
                    <div className="absolute translate-x-4 -translate-y-1/2">
                        <img className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black object-cover" src={userProfile.profilePicture || "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"} alt="Profile Pic" />
                    </div>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-2 m-4 mt-6">
                    <div className="text-right text-sm font-semibold">
                        {
                            userProfile.username === user.username ? (
                                <Link to='edit' className="border border-stone-700 px-4 pb-1 pt-1 md:py-2 rounded-full hover:border-stone-500 transition-all">
                                    Edit Profile
                                </Link>
                            ) : (
                                <button className="border border-stone-700 px-4 pb-1 pt-1 md:py-2 rounded-full hover:border-stone-500 transition-all" onClick={toggleFollow}>
                                    {userProfile.isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )
                        }
                    </div>
                    <div className="md:mt-4">
                        <h3 className="text-lg font-bold">
                            {userProfile.fullName} <BadgeCheck className={`inline-block ml-1 self-center text-black ${userProfile.subscription == "Premium" ? 'bg-primary' : 'bg-yellow-500'} rounded-full`} size={16} />
                        </h3>
                        <p className="text-stone-500">
                            @{userProfile.username}
                        </p>
                    </div>
                    <div className="my-1 text-sm md:text-base">
                        {userProfile.bio}
                    </div>
                    <div className="flex align-middle gap-2 text-sm md:text-base text-stone-500">
                        <CalendarDays size={18} /> <span className="mt-[-3px]">Joined {new Date(userProfile.createdAt).toDateString()} </span>
                    </div>
                    <div className="flex gap-4 text-sm md:text-base">
                        <Link to='following'>
                        {userProfile.following.length} <span className="text-stone-500">Following</span>
                        </Link>
                        <Link to='followers'>
                        {followersCount} <span className="text-stone-500">Followers</span>
                        </Link>
                    </div>
                </div>

                {/* navigation */}
                <div className={"flex flex-wrap justify-between gap-4 px-4 font-medium border-[1px] border-x-black border-t-black border-b-stone-800"}>
                    <NavLink 
                    onClick={() => filterTweets('tweets')} 
                    className={`rounded-b-sm p-2 px-4 hover:bg-stone-400/10 ${activeTab == 'tweets' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Tweets</NavLink>
                    <NavLink 
                    onClick={() => filterTweets('retweets')} 
                    className={` p-2 px-4 rounded-b-sm hover:bg-stone-400/10 ${activeTab == 'retweets' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Retweets</NavLink>
                    <NavLink 
                    onClick={() => filterTweets('following')} 
                    className={`hidden md:inline-block p-2 px-4 rounded-b-sm hover:bg-stone-400/10 ${activeTab == 'following' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Replies</NavLink>
                    <NavLink 
                    onClick={() => filterTweets('likes')} 
                    className={`p-2 px-4 rounded-b-sm hover:bg-stone-400/10 ${activeTab == 'likes' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Likes</NavLink>
                </div>


                {/* Tweets section */}

                {tweetsData.length > 0 ? tweetsData.map(tweet => (
                    <Tweet key={tweet._id} {...tweet} onDelete={deleteTweetFromProfile} />
                )) : (<Tweet/>)}
                

            </div>

            <RightSidebar />
        </main>
    )
}

export default Profile
