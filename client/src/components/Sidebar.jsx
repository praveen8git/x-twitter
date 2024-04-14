import { Home, Search, UserRound, LogOut, Feather, BadgeCheck } from "lucide-react";
import { useContext } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const Sidebar = () => {

  const navigate = useNavigate();
  const { user, logout } = useContext(IsAuthenticatedContext);


  const handleLogout = async (e) => {
    e.preventDefault();

    let fetch = axios.get(VITE_SERVER + "/auth/logout", {
      withCredentials: true,
    });

    toast.promise(fetch, {
      loading: 'Logging out...',

      success: (res) => {
        console.log(res.data);
       
        if (res.data.success) {
          logout();
          navigate("/login");
          return "Logged out!"
        }},

        error: (err) => `Error: ${err.response ? err.response.data.message.toString() : err.toString()}`,
    });
  };

  return (
    <section className='flex flex-col h-full'>
      <Link to="/" className="logo invert my-4 mx-2 self-center lg:self-start lg:mx-16">

        <svg viewBox="0 0 24 24" aria-hidden="true"
          className="w-8 m-auto r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp r-1nao33i r-16y2uox r-8kz0gk">
          <g>
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
            </path>
          </g>
        </svg>

      </Link>
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col text-lg space-y-0 px-2 lg:px-11 font-bold w-full justify-center">
          <NavLink to="/"
            className={`flex lg:justify-start items-center gap-3 justify-center  mr- lg:w-fit  hover:bg-stone-900 hover:cursor-pointer p-4 lg:py-3 hover:rounded-full transition-all duration-200`  }>
            <Home absoluteStrokeWidth /> <span
              className="hidden lg:block">Home</span>
          </NavLink>
          <Link to="/explore"
            className="flex lg:justify-start items-center gap-3 justify-center  mr- lg:w-fit  hover:bg-stone-900 hover:cursor-pointer p-4 lg:py-3 hover:rounded-full transition-all duration-200">
            <Search absoluteStrokeWidth />
            <span className="hidden lg:block">Explore</span>
          </Link>
          <Link to={"/profile/" + user?.username}
            className="flex lg:justify-start items-center gap-3 justify-center  mr- lg:w-fit  hover:bg-stone-900 hover:cursor-pointer p-4 lg:py-3 hover:rounded-full transition-all duration-200">
            <UserRound absoluteStrokeWidth /><span
              className="hidden lg:block">Profile</span>
          </Link>
          <Link onClick={handleLogout}
            className="flex lg:justify-start items-center gap-3 justify-center  mr- lg:w-fit  hover:bg-stone-900 hover:cursor-pointer p-4 lg:py-3 hover:rounded-full transition-all duration-200">
            <LogOut absoluteStrokeWidth /><span
              className="hidden lg:block">Logout</span>
          </Link>
          <li>
            <div className="button w-full text-center my-4">
              <button
                className="hidden lg:block bg-primary px-20 text-xl rounded-full py-3 text-white">Post</button>
              <button className="lg:hidden bg-primary  px-2 lg:px-4 text-xl rounded-full py-2 lg:py-3 text-white hover:p-4 transition-all">
                <Feather size={20} absoluteStrokeWidth />
              </button>
            </div>
          </li>
        </ul>
        <ul className="flex flex-col text-lg space-y-0 px- lg:px-11 font- w-full justify-center mb-4">
          <Link to={"/profile/" + user?.username}
            className="flex lg:justify-start items-center gap-3 justify-center ml-2 lg:ml-0 w-fit  hover:cursor-pointer rounded-full transition-all duration-200">
            <img src={
                        user?.profilePicture === "" ?
                            "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                            : user.profilePicture
                    } className='h-12 w-12 rounded-full object-cover' />
            <div className='text-base'>
              <span className="hidden lg:flex">{user?.fullName} <BadgeCheck className={`inline ml-1 self-center text-black ${user?.subscription === "Premium" ? 'bg-primary' : 'bg-yellow-500'
                        } rounded-full`} size={16} /> </span> 
              <p className="hidden lg:block text-stone-500">@{user?.username}</p>
            </div>
          </Link>
        </ul>
      </div>
    </section>
  )
}

export default Sidebar
