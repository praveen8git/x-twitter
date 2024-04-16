import { BadgeCheck } from "lucide-react";
import axios from "axios";
// import { RightSidebar, Sidebar, Tweet } from "../components";
import { Link, NavLink } from "react-router-dom";
import toast from 'react-hot-toast';
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const RightSidebar = () => {

  const { user: loggedUser } = useContext(IsAuthenticatedContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await axios.get(`${VITE_SERVER}/api/random-users`, {
          withCredentials: true,
        });
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch random users:', error);
      }
    };

    fetchRandomUsers();
  }, []);

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
    <div className="hidden min-[1180px]:block sticky top-0 max-w-[350px] min-h-screen max-h-screen">
      <div className="flex flex-col h-full gap-4 px-4">

        <div className="bg-stone-300/10 rounded-lg p-4 mt-4">
          <h3 className=" mb-2 font-medium text-lg">Subscribe to Premium</h3>
          <p className=" text-sm">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
          </p>
          <div className=" mt-2">
            <button
              className="bg-primary px-5 md:px-6 text-center text-sm rounded-full pt-2 pb-1 md:py-2 text-white font-bold">
              Subscribe
            </button>
          </div>
        </div>

        <div className="bg-stone-300/10 rounded-lg p-4">
          <h3 className=" mb-2 font-medium text-lg">People you may Know</h3>

          {
            users.map(user => (
              <ul key={user._id} className="flex flex-col text-lg space-y-0 mt-4 w-full mb-4">
                <li className="flex justify-between gap-3 ml-2 lg:ml-0 w-full  hover:cursor-pointer rounded-full transition-all duration-200">
                  <Link to={'/profile/'+ user.username} className="flex gap-3">
                    <img src={
                      user?.profilePicture === "" ?
                        "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                        : user.profilePicture
                    } className='h-10 w-10 rounded-full object-cover' />
                    <div className='text-sm'>
                      <span className="hidden lg:flex line-clamp-1 text-nowrap">{user.fullName} <BadgeCheck className={`inline-block ml-1 self-center text-black ${user.subscription == "Premium" ? 'bg-primary' : 'bg-yellow-500'} rounded-full`} size={16} /> </span>
                      <p className="hidden lg:block text-stone-500">@{user.username}</p>
                    </div>
                  </Link>
                  <div className="self-center">
                    <button onClick={() => { toggleFollow(user.username) }} className="font-semibold border border-stone-700 px-4 py-0.5 pt-1.5 rounded-full text-sm bg-stone-200 text-black">
                      {
                        user.followers && loggedUser && user.followers.includes(loggedUser._id) ? 'Following' : 'Follow'
                      }
                    </button>
                  </div>
                </li>
              </ul>
            ))
          }


        </div>

        <div className="flex flex-wrap gap-x-2 p-4 text-sm text-stone-500 transition-all">
          <a href="#" className="hover:text-primary">Term of Service</a>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Cookie Policy</a>
          <a href="#" className="hover:text-primary">Accessibility</a>
          <a href="#" className="hover:text-primary">Ads Info</a>
          {/* <a href="#" className="hover:text-primary">More...</a> */}
          <span>© 2024 𝕏 Corp.</span>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
