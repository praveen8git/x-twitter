import axios from "axios";
import toast from 'react-hot-toast';
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTimeFormatter from "../hooks/useTimeFormatter";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import { BadgeCheck, MessageSquare, Repeat2, Heart, BarChart2, Trash2 } from "lucide-react";
import ModalContext from "../contexts/ModalContext";

const { VITE_SERVER } = import.meta.env;

const Tweet = (props) => {
    if (!props || !props.tweetBy) {
        return (
            // Skeleton loader
            <div className="animate-pulse">
                <div className="flex items-center m-4">
                    <svg className="w-10 h-10 me-3 text-stone-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                        <div className="h-2.5  bg-stone-800 rounded-full   w-32 mb-2"></div>
                        <div className="w-48 h-2  bg-stone-800 rounded-full  "></div>
                    </div>
                </div>
                <div className="px-12">
                    <div className="h-2  bg-stone-800 rounded-full   mb-2.5"></div>
                    <div className="h-2  bg-stone-800 rounded-full   mb-2.5"></div>
                    {/* <div className="h-2  bg-stone-800 rounded-full  "></div> */}
                    <div className="flex items-center justify-center h-48 mt-1 mb-4 bg-stone-800 rounded  ">
                        <svg className="w-10 h-10 text-stone-950" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        </svg>
                    </div>
                </div>

            </div>
        )
    }

    const navigate = useNavigate();

    const { login, user } = useContext(IsAuthenticatedContext);

    // Handle Like -------->
    const [likesCount, setLikesCount] = useState(props.likes.length);
    const [isLiked, setIsLiked] = useState(props.likes.includes(user._id));
    const handleLike = async () => {
        // Update the UI immediately
        setIsLiked(!isLiked);
        setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);

        // Send the like request to the server
        const tweetId = props._id;
        const url = `${VITE_SERVER}/api/like/${tweetId}`;

        const likeRequest = axios.patch(url, {}, {
            withCredentials: true,
        });

        toast.promise(likeRequest, {
            loading: 'Liking tweet...',
            success: () => {

                return !isLiked ? 'Liked!' : 'Unliked!'
            },
            error: (err) => {
                // revert the UI update if the server update fails
                setIsLiked(!isLiked);
                setLikesCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
                return `Failed to like tweet: ${err.response ? err.response.data.message : err.message}`
            },
        });
    };

    // Tweet delete handler ------>
    const handleDelete = async () => {
        const tweetId = props._id; // the tweet ID is part of the tweetData object

        // Construct the URL for the delete tweet API endpoint
        const url = `${VITE_SERVER}/api/tweet/${tweetId}`;

        // Make the delete request
        const deleteRequest = axios.delete(url, {
            withCredentials: true,
        });

        // Use toast.promise to display a toast notification based on the outcome of the delete request
        toast.promise(deleteRequest, {
            loading: 'Deleting tweet...',
            success: () => {
                // delete callback to update the parent component
                props.onDelete(tweetId);
                return 'Tweet deleted successfully!';
            },
            error: (err) => `Failed to delete tweet: ${err.response ? err.response.data.message : err.message}`,
        });
    };

    // Retweet
    const { onOpenModal } = useContext(ModalContext);
    // console.log(props);

    return (
        <div className="flex py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800 hover:bg-stone-400/5 transition-all duration-200">
            <Link to={`/profile/${props.tweetBy.username}`} className="w-16 h-fit">
                <img className="h-12 w-12 rounded-full object-cover"
                    src={
                        props.tweetBy.profilePicture === "" ?
                            "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                            : props.tweetBy.profilePicture
                    } alt="DP" />
            </Link>
            <div className="flex flex-col mx-3 w-full">

                <div className="flex justify-between flex-wrap gap-2 mb-3 ">
                    <div className="flex flex-wrap gap-2 ">
                        <Link to={`/profile/${props.tweetBy.username}`} className="font-medium hover:underline cursor-pointer">
                            {props.tweetBy.fullName}
                        </Link>
                        <BadgeCheck className={`self-center text-black ${props.tweetBy.subscription === "Premium" ? 'bg-primary' : 'bg-yellow-500'
                            } rounded-full`} size={16} />

                        <span className="text-stone-500">@{props?.tweetBy.username}</span>
                        <span className="font-bold text-stone-500 mt-[-5px]">.</span>
                        <span className="text-stone-500 self-center">{useTimeFormatter(props.createdAt)}</span>
                    </div>
                    {
                        user?._id != props.tweetBy._id ? '' : (
                            <button className="flex gap-1 text-stone-500 text-xs hover:text-red-600"
                                onClick={handleDelete}>
                                <Trash2 size={16} /> <span className="hidden md:inline">Delete</span>
                            </button>
                        )
                    }
                </div>

                <Link to={`/tweet/${props._id}`} className="mb-3 break-words text-wrap text-sm md:text-base">
                    {props.text}
                </Link>

                {
                    props.image === "" ? '' : (
                        <Link to={`/tweet/${props._id}`} className="pb-4 relative w-fit">
                            <img className="rounded-md w-full object-cover" src={props.image} alt="" />
                        </Link>
                    )
                }

                {/* qouted tweet */}
                {
                    props.retweetedThis.length > 0 ? (
                        <div onClick={() => navigate(`/tweet/${props.retweetedThis[0]._id}`)} className="flex py-5 px-3 transition-all duration-200 border-[1px] border-stone-800 hover:bg-stone-400/5 rounded-2xl cursor-pointer">
                            <Link to={`/profile/${props?.retweetedThis[0].tweetBy.username}`} className="w-12 h-fit">
                                <img className="h-10 w-10 rounded-full object-cover"
                                    src={
                                        props.retweetedThis[0].tweetBy.profilePicture === "" ?
                                            "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                                            : props.retweetedThis[0].tweetBy.profilePicture
                                    } alt="DP" />
                            </Link>
                            <div className="flex flex-col ml-3 w-full">

                                <div className="flex flex-wrap gap-2 mb-3 ">
                                    <Link to={`/profile/${props.retweetedThis[0].tweetBy.username}`} className="font-medium hover:underline cursor-pointer">
                                        {props.retweetedThis[0].tweetBy.fullName}
                                    </Link>
                                    <BadgeCheck className={`self-center text-black ${props.retweetedThis[0].tweetBy.subscription === "Premium" ? 'bg-primary' : 'bg-yellow-500'
                                        } rounded-full`} size={16} />

                                    <span className="text-stone-500">@{props?.retweetedThis[0].tweetBy.username}</span>
                                    <span className="font-bold text-stone-500 mt-[-5px]">.</span>
                                    <span className="text-stone-500 self-center">{useTimeFormatter(props.retweetedThis[0].createdAt)}</span>
                                </div>

                                <div className="mb-3 break-words text-wrap text-sm md:text-base">
                                    {props.retweetedThis[0].text}
                                </div>

                                {
                                    props.image === "" ? '' : (
                                        <div className="pb-4 relative w-fit">
                                            <img className="rounded-md w-full object-cover" src={props.retweetedThis[0].image} alt="" />
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    ) : ""
                }

                {/* actions */}
                <div className="flex justify-between mt-3 text-sm text-gray-500">

                    <div onClick={() => {navigate(`/tweet/${props._id}/#text`)}} className="flex items-center justify-center  hover:text-primary hover:cursor-pointer">
                        <MessageSquare className=" hover:bg-primary/5 hover:rounded-full p-2" size={36} /> {props.comments.length}
                    </div>

                    <div onClick={() => { onOpenModal(props._id); }} className="flex items-center justify-center  hover:text-green-500 hover:cursor-pointer">
                        <Repeat2 className=" hover:bg-green-600/5 hover:rounded-full p-2" size={36} /> {props.retweets.length}
                    </div>

                    <div className="flex items-center justify-center hover:text-rose-600 hover:cursor-pointer" onClick={handleLike}>
                        {isLiked ? <Heart fill="#e00d49" className="hover:bg-rose-600/5 hover:rounded-full p-2 text-rose-600" size={36} /> : <Heart className="hover:bg-rose-600/5 hover:rounded-full p-2" size={36} />} {likesCount}
                    </div>

                    <div className="hidden lg:flex items-center justify-center  hover:text-yellow-600 hover:cursor-pointer">
                        <BarChart2 className=" hover:bg-yellow-600/5 hover:rounded-full p-2" size={36} /> 10k
                    </div>

                </div>


            </div>
            {/* Modal */}
            {/* <RetweetModal id={props._id} /> */}
        </div>
    )
}

export default Tweet
