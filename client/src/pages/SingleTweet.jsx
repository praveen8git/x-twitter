import axios from "axios";
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useImageUploader } from "../hooks/useImageUploader";
import { ArrowLeft, ImagePlus, X, Earth, BadgeCheck, MessageSquare, Repeat2, Heart, BarChart2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { RightSidebar, Sidebar, Tweet, Comment } from "../components";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const SingleTweet = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(IsAuthenticatedContext);

    // Comment delete handler ----->
    const handleCommentDelete = (commentId) => {
        setTweetData(prevState => ({
            ...prevState,
            comments: prevState.comments.filter(comment => comment._id !== commentId)
        }));
    };

    const handleTweetDelete = () => {
        navigate('/');
    }
    
    // Load Tweet ------>
    const { tweetId } = useParams();
    const [tweetData, setTweetData] = useState();
    
    const getTweetData = async () => {
        
        let fetch = axios.get(VITE_SERVER + `/api/tweet/${tweetId}`, {
            withCredentials: true,
        });
        
        try {
            const response = await fetch;
            // console.log(response.data);
            setTweetData(response.data);
        } catch (error) {
            console.error(error);
        }
        
    }
    
    
    useEffect(() => {
        getTweetData();
    }, [])

    // Comment Posting ------>
    const [commentText, setCommentText] = useState("");
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const submitPost = async (e) => {
        e.preventDefault();

        let imageUrl = image !== null ? await useImageUploader(image) : "";

        let postData = {
            commentText: commentText,
            image: imageUrl,
            tweet: tweetId,
            user: user._id
        }

        let fetch = axios.post(VITE_SERVER + "/api/comment", postData, {
            withCredentials: true,
        });

        toast.promise(fetch, {
            loading: 'Posting comment...',

            success: (res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    setCommentText(""); // empty textfield
                    setImage(null); // empty image
                    setSelectedImage(null); // empty image preview
                    getTweetData(); // refresh tweet data
                    // setTweetData(prevState => prevState.comments.push(res.data.comment)); // This don't work because data is unpopulated
                    return "Comment posted"
                }
            },

            error: (err) => `Failed: ${err.response ? err.response.data.message.toString() : err.toString()}`,
        });
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
                    <div className="font-medium">Tweet</div>
                </div>


                {/* Tweets section */}
                {
                    tweetData && <Tweet onDelete={handleTweetDelete} {...tweetData} />
                }

                {/* Comment section */}
                <div className="flex py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
                    <Link to={"/profile/" + user?.username} className="w-16 h-fit">
                        <img className="h-12 w-12 rounded-full object-cover" src={
                            user?.profilePicture === "" ?
                                "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                                : user.profilePicture
                        } alt="" />
                    </Link>
                    <form onSubmit={submitPost} className="flex flex-col mx-3 w-full">

                        <TextareaAutosize
                            className="bg-black text-white outline-none w-full h-10 md:text-xl placeholder:text-stone-500 resize-none"
                            placeholder="Post your comment"
                            onChange={(e) => { setCommentText(e.target.value) }}
                            value={commentText}
                            name="text"
                            id="text" />

                        <div className="flex w-fit pt-1 px-2 text-primary text-sm mt-3 gap-x-2 font-medium hover:bg-primary/10 rounded-full">
                            <Earth size={15} className="self-center bg-primary text-black rounded-full" /> <span className="self-center font-semibold text-xs md:text-base">Everyone can see this</span>
                        </div>

                        <div className="w-full h-[1px] bg-stone-800 my-3"></div>

                        {
                            selectedImage === null ? "" : (
                                <div className="pb-4 relative w-fit">
                                    <img
                                        className="rounded-md w-full object-cover"
                                        src={selectedImage}
                                        alt="" />

                                    <X
                                        onClick={() => setSelectedImage(null) && setImage(null)}
                                        className="text-red-600 bg-black rounded-full absolute top-2 right-2 p-1 cursor-pointer"
                                        size={24}
                                        absoluteStrokeWidth />
                                </div>
                            )
                        }

                        <div className="flex justify-between">

                            <div className="blueicons flex gap-2 text-primary items-center">
                                <label htmlFor="postImage" className="cursor-pointer h-full">
                                    <ImagePlus absoluteStrokeWidth />
                                    <input type="file"
                                        accept="image/*"
                                        onChange={(e) => { setImage((prev) => e.target.files[0]); setSelectedImage(URL.createObjectURL(e.target.files[0])) }}
                                        className='hidden'
                                        name="postImage"
                                        id="postImage" />
                                </label>
                            </div>
                            <div className="postbtn mr-1">
                                <button
                                    disabled={commentText.trim() == "" && selectedImage == null}
                                    type="submit"
                                    className="bg-primary px-5 md:px-6 text-center text-sm rounded-full pt-2 pb-1 md:py-2 text-white font-bold disabled:bg-primary/50 disabled:text-white/50">
                                    Comment
                                </button>
                            </div>

                        </div>


                    </form>
                </div>

                {/* Comments */}
                {
                    tweetData?.comments.length > 0 ? (
                        tweetData.comments.map(comment => <Comment key={comment._id} onDelete={handleCommentDelete} {...comment} />)
                    ) : (
                        <p className="p-5 text-center">No comments yet.</p>
                    )
                }

            </div>

            <RightSidebar />
        </main>
    )
}

export default SingleTweet
