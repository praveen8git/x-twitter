import { BadgeCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useTimeFormatter from "../hooks/useTimeFormatter";
import { useContext } from "react";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
import toast from 'react-hot-toast';
import axios from "axios";

const { VITE_SERVER } = import.meta.env;

const Comment = (props) => {
    if (!props || !props.user) {
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
                    {/* <div className="flex items-center justify-center h-48 mt-1 mb-4 bg-stone-800 rounded  ">
                        <svg className="w-10 h-10 text-stone-950" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        </svg>
                    </div> */}
                </div>

            </div>
        )
    }

    const { login, user } = useContext(IsAuthenticatedContext);

    const handleDelete = async () => {
        const commentId = props._id; // Assuming the comment ID is passed as a prop
        const tweetId = props.tweet; // Assuming the tweet ID is passed as a prop
    
        // Construct the URL for the delete comment API endpoint
        const url = `${VITE_SERVER}/api/comment/${commentId}`;
    
        // Make the delete request
        const deleteRequest = axios.delete(url, {
            withCredentials: true,
        });
    
        // Use toast.promise to display a toast notification based on the outcome of the delete request
        toast.promise(deleteRequest, {
            loading: 'Deleting comment...',
            success: (res) => {
                if (res.status === 200) {
                    // removing the comment from the local state the parent component by calling the callback function passed down from the parent component to update its state
                    props.onDelete(commentId);
                    return 'Comment deleted successfully!';
                }
            },
            error: (err) => `Failed to delete comment: ${err.response ? err.response.data.message : err.message}`,
        });
    };

    return (
        <div className="flex py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800 hover:bg-stone-400/5 transition-all duration-200">
            <Link to={`/profile/${props.user.username}`} className="w-16 h-fit">
                <img className="h-12 w-12 rounded-full object-cover" src={
                    props.user.profilePicture === "" ?
                        "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                        : props.user.profilePicture
                } alt="" />
            </Link>
            <div className="flex flex-col mx-3 w-full">

                <div className="flex justify-between flex-wrap gap-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                        <Link to={`/profile/${props.user.username}`} className="font-medium hover:underline cursor-pointer">{props.user.fullName}</Link>
                        <BadgeCheck className={`self-center text-black ${props.user.subscription === "Premium" ? 'bg-primary' : 'bg-yellow-500'
                            } rounded-full`} size={16} />
                        <span className="text-stone-500">@{props.user.username}</span>
                        <span className="font-bold text-stone-500 mt-[-5px]">.</span>
                        <span className="text-stone-500 self-center">{useTimeFormatter(props.createdAt)}</span>
                    </div>

                    {
                        user?._id != props.user._id ? '' : (
                            <button className="flex gap-1 text-stone-500 text-xs hover:text-red-600"
                                onClick={handleDelete}>
                                <Trash2 size={16} /> <span className="hidden md:inline">Delete</span>
                            </button>
                        )
                    }
                </div>

                <p className="mb-3 break-words text-wrap text-sm md:text-base">
                    {props.commentText}
                </p>

                {
                    props.image === "" ? '' : (
                        <div className="pb-4 relative w-fit">
                            <img className="rounded-md w-full object-cover" src={props.image} alt="" />
                        </div>
                    )
                }




            </div>
        </div>
    )
}

export default Comment
