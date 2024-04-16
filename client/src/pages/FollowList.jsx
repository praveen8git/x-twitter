import { RightSidebar, Sidebar,} from "../components";
import { ArrowLeft, BadgeCheck, } from "lucide-react";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const FollowList = (props) => {

    const { user: loggedUser } = useContext(IsAuthenticatedContext);
    const navigate = useNavigate();

    console.log(props.list);
    const { username } = useParams();

    const [users, setUsers] = useState([]);

    const [activeTab, setActiveTab] = useState(props.list);

    const showList = async (activeList) => {
        setActiveTab(activeList);
        try {
            const response = await axios.get(`${VITE_SERVER}/api/${activeList.toLowerCase()}/${username}`, {
                withCredentials: true,
            });
            let list = activeList.toLowerCase();
            setUsers(response.data[0][list]);
            // console.log(response.data[0][list]);
        } catch (error) {
            console.error(error);
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

    useEffect(() => {
        showList(props.list);
    }, [])

    console.log(users);

    // const toggleFollow = async (username) => {
    //     try {
    //         const response = await axios.patch(`${VITE_SERVER}/api/follow/${username}`, {}, {
    //             withCredentials: true,
    //         });
    //         // Update the userProfile state to reflect the new follow status
    //         // console.log(response.data, 'toggle follow');
    //         setUserProfile({ ...userProfile, isFollowing: !userProfile.isFollowing });
    //         setFollowersCount(response.data.followers.length)
    //         toast.success(userProfile.isFollowing ? "Unfollowed" : "Followed");
    //     } catch (error) {
    //         console.error("Failed to toggle follow:", error);
    //         toast.error("Failed to toggle follow");
    //     }
    // };  

    return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
                {/* Searchbar section */}
                <div className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="flex flex-col justify-center">
                        <ArrowLeft onClick={() => navigate(-1, { replace: true })} />
                    </div>
                    <div className="font-medium">{props.list}</div>
                </div>



                {/* navigation */}
                <div className={"flex flex-wrap justify-evenly gap-4 px-4 font-medium border-[1px] border-x-black border-t-black border-b-stone-800"}>
                    <NavLink
                        onClick={() => { showList('Following') }}
                        className={`rounded-b-sm p-2 px-6 md:px-8 hover:bg-stone-400/10 ${activeTab == 'Following' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Followings
                    </NavLink>
                    <NavLink
                        onClick={() => { showList('Followers') }}
                        className={` p-2 px-6 md:px-8 rounded-b-sm hover:bg-stone-400/10 ${activeTab == 'Followers' ? "border-b-4 border-b-primary" : "text-stone-500"}`}>
                        Followers
                    </NavLink>
                </div>

                {/* User list */}

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
                                            user.followers.includes(loggedUser._id) ? 'Following' : 'Follow'
                                        }
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center w-full my-6">No users here...</div>
                    )

                }

                {/* Tweets section */}
                {/* <Tweet /> */}

            </div>

            <RightSidebar />
        </main>
    )
}

export default FollowList
