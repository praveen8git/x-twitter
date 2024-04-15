import { RightSidebar, Sidebar } from "../components";
import { ArrowLeft, BadgeCheck, CalendarDays, ImageUp, Pencil, Upload } from "lucide-react";
import { Link, useNavigate, useParams, NavLink } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { useImageUploader } from "../hooks/useImageUploader";

const { VITE_SERVER } = import.meta.env;

const EditProfile = () => {
    const { user, login } = useContext(IsAuthenticatedContext);

    const navigate = useNavigate();
    const { username } = useParams();

    useEffect(() => {
        if (user) {
            if (username !== user.username) {
                toast.error('Cannot edit profile of other user')
                navigate(-1);
            }
        }
    }, [user])

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${VITE_SERVER}/api/profile/${username}`, {
                withCredentials: true,
            });
            // console.log(response.data);
            setUserProfile(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [username]);

    const [coverImage, setCoverImage] = useState(null);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);

    const [formData, setFormData] = useState({});

    const updateProfile = async (e) => {
        e.preventDefault();

        let coverImageUrl = coverImage ? await useImageUploader(coverImage) : userProfile.coverPicture;
        let profileImageUrl = profileImage ? await useImageUploader(profileImage) : userProfile.profilePicture;

        // setFormData(async (prev) => ({
        //     ...prev,
        //     profilePicture: await profileImageUrl,
        //     coverPicture: await coverImageUrl
        // }))

        let patch = {
            ...formData,
            profilePicture: profileImageUrl,
            coverPicture: coverImageUrl
        }

        console.log('before fetch',patch);

        let fetch = axios.patch(VITE_SERVER + "/api/profile/" + userProfile._id, patch, {
            withCredentials: true,
        });

        toast.promise(fetch, {
            loading: 'Updating...',
            success: (res) => {
                console.log('success',res.data);
                if (res.status == 201) {
                    // update data in context
                    login({
                        username: user.username,
                        _id: user._id,
                        fullName: res.data.fullName,
                        subscription: user.subscription,
                        profilePicture: res.data.profilePicture
                      })
                    navigate("/profile/" + user.username)
                    return "Updated!"
                }
            },
            error: (err) => `Error: ${err.response ? err.response.data.message.toString() : err.toString()}`,
        });
    };


    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    if (loading) {
        return <div className="w-screen h-screen text-center py-[20%] bg-black animate-bounce">Loading...</div>;
    }


    if (user !== null) return (
        <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
            <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
                <Sidebar />
            </div>
            <form onSubmit={updateProfile} className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
                {/* Topbar section */}
                <div className="flex gap-x-5 py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <div className="cursor-pointer">
                        <ArrowLeft onClick={() => navigate(-1, { replace: true })} />
                    </div>
                    <div className="font-medium">Edit your profile</div>
                </div>

                {/* Cover and Profile Picture */}
                <div className="relative">
                    <img className="h-28 md:h-52 w-full object-cover" src={!coverImage ? (userProfile.coverPicture || "https://imgtr.ee/images/2024/04/15/b1b16031d7f4176b5093cff05dfa0be4.png") : selectedCoverImage} alt="cover" />
                    <label htmlFor="coverImage" className="cursor-pointer h-full">
                        <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 hover:opacity-45 transition-all">
                            <ImageUp className="top-1/2 left-1/2 absolute    -translate-x-1/2 -translate-y-1/2" absoluteStrokeWidth size={36} />
                        </div>
                        <input type="file"
                            accept="image/*"
                            onChange={(e) => { setCoverImage((prev) => e.target.files[0]); setSelectedCoverImage(URL.createObjectURL(e.target.files[0])) }}
                            className='hidden'
                            name="coverImage"
                            id="coverImage" />
                    </label>
                    <div className="absolute translate-x-4 -translate-y-1/2">
                        <img className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black object-cover" src={!profileImage ? (userProfile.profilePicture || "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg") : selectedProfileImage} alt="Profile Pic" />
                        <label htmlFor="profileImage">
                            <div className="bg-black absolute top-0 bottom-0 left-0 right-0 rounded-full opacity-30 hover:opacity-45 transition-all">
                                <ImageUp className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-3/4" absoluteStrokeWidth strokeWidth={1.5} size={24} />
                            </div>
                            <input type="file"
                                accept="image/*"
                                onChange={(e) => { setProfileImage((prev) => e.target.files[0]); setSelectedProfileImage(URL.createObjectURL(e.target.files[0])) }}
                                className='hidden'
                                name="profileImage"
                                id="profileImage" />
                        </label>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-2 m-4">
                    <div className="text-right text-sm font-semibold">
                        <button type="submit" className="border border-stone-700 text-black bg-stone-200 px-6 py-1 md:py-2 rounded-full hover:bg-stone-300 transition-all">
                            Save
                        </button>

                    </div>
                    <div className="md:mt-4 md:mx-8">
                        <input
                            className='w-full px-4 p-2 bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                            type="text" name="fullName" id="fullName"
                            autoComplete='false'
                            placeholder={userProfile.fullName || 'Enter your full name'}
                            // value={userProfile.fullName}
                            onChange={(e) => onChangeHandler(e)}
                            required />
                    </div>
                    <div className="my-2 md:mx-8 text-sm md:text-base">
                        <textarea
                            className='w-full px-4 p-2 bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                            name="bio" id="bio"
                            autoComplete='false'
                            placeholder={userProfile.bio || 'Write something for your bio'}
                            // value={userProfile.bio || ''}
                            onChange={(e) => onChangeHandler(e)}
                            required></textarea>
                    </div>
                    {/* <div className="flex align-middle gap-2 text-sm md:text-base text-stone-500">
                        <CalendarDays size={18} /> <span className="mt-[-3px]">Joined {new Date(userProfile.createdAt).toDateString()} </span>
                    </div>
                    <div className="flex gap-4 text-sm md:text-base">
                        <Link>
                            {userProfile.followers.length} <span className="text-stone-500">Following</span>
                        </Link>
                        <Link>
                            {userProfile.following.length} <span className="text-stone-500">Followers</span>
                        </Link>
                    </div> */}
                </div>

            </form>

            <RightSidebar />
        </main>
    )
}

export default EditProfile
