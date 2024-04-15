import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { ImagePlus, X, Earth } from "lucide-react";
import ModalContext from '../contexts/ModalContext';
import TextareaAutosize from 'react-textarea-autosize';
import { useContext, useEffect, useState } from "react";
import { useImageUploader } from "../hooks/useImageUploader";
import IsAuthenticatedContext from '../contexts/IsAuthenticatedContext';

const { VITE_SERVER } = import.meta.env;

// - this componet serve as retweet as well as tweet modal,
// - based on whether tweet id was passed in onModalOpen context.
// - if tweet id is passed then it is a retweet request. otherwise a new tweet.

const RetweetModal = (props) => {

    const { open, onCloseModal, tweetId } = useContext(ModalContext);// console.log(tweetId,'modal')
    const { user } = useContext(IsAuthenticatedContext);

    // Post a retweet ------>
    const [retweetText, setRetweetText] = useState("");
    const [retweetImage, setRetweetImage] = useState(null);
    const [selectedRetweetImage, setSelectedRetweetImage] = useState(null);
    const onImageChange = (e) => { 
        e.stopPropagation(); 
        setRetweetImage((prev) => e.target.files[0]); 
        setSelectedRetweetImage(URL.createObjectURL(e.target.files[0])) 
    }
    const submitRetweet = async (e) => {
        e.preventDefault();

        let imageUrl = retweetImage !== null ? await useImageUploader(retweetImage) : "";

        let postData = {
            text: retweetText,
            image: imageUrl,
            tweetId: tweetId
        }

        let requestUrl = tweetId ? VITE_SERVER + "/api/retweet" : VITE_SERVER + "/api/tweet";

        let fetch = axios.post(requestUrl, postData, {
            withCredentials: true,
        });

        toast.promise(fetch, {
            loading: () => tweetId ? 'Retweeting...' : 'Tweeting',

            success: (res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    setRetweetText(""); // empty textfield
                    setRetweetImage(null); // empty image
                    setSelectedRetweetImage(null); // empty image preview
                    onCloseModal();
                    // Append the new tweet to the beginning of the tweets array
                    //setTweets([res.data, ...tweets]); // not returning populated data
                    return tweetId ? 'Retweeted...' : 'Tweeted'
                }
            },

            error: (err) => `Failed: ${err.response ? err.response.data.message.toString() : err.toString()}`,
        });
    }

    useEffect(() => {
        if (!open) {
            setRetweetText(""); // empty textfield
            // Reset the selected image when the modal is closed
            setSelectedRetweetImage(null);
            setRetweetImage(null);
        }
    }, [open]);

    // useEffect(() => {
    //     console.log(retweetImage, 'i');
    //     console.log(selectedRetweetImage, 'si');
    // }, [retweetImage, selectedRetweetImage])
    return (
        <Modal
            open={open}
            onClose={onCloseModal}
            focusTrapped={false}
            center
            
            classNames={{
                overlay: 'backdrop-blur-sm',
                modal: 'm-0 p-0 bg-black border-[1px] border-stone-800',
                closeIcon: 'text-white fill-stone-300'
            }}>
            <div className="flex py-5 px-3">
                <Link to={"/profile/" + user?.username} className="w-16 h-fit">
                    <img className="h-12 w-12 rounded-full object-cover" src={
                        user?.profilePicture === "" ?
                            "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                            : user.profilePicture
                    } alt="DP" />
                </Link>
                <form onSubmit={submitRetweet} className="flex flex-col mx-3 w-full">

                    <TextareaAutosize
                        className="bg-black text-white outline-none w-full h-10 text-xl placeholder:text-stone-500 resize-none"
                        placeholder={tweetId ? "Add something ?!" : "What is Happening ?!"}
                        onChange={(e) => { setRetweetText(e.target.value) }}
                        value={retweetText}
                        autoFocus
                        name="text"
                        id="text" />

                    <div className="flex w-fit pt-1 px-2 text-primary text-sm mt-3 gap-x-2 font-medium hover:bg-primary/10 rounded-full">
                        <Earth size={15} className="self-center bg-primary text-black rounded-full" /> <span className="self-center font-semibold">Everyone can reply</span>
                    </div>

                    <div className="w-full h-[1px] bg-stone-800 my-3"></div>

                    {
                        selectedRetweetImage && (
                            <div className="pb-4 relative w-fit">
                                <img
                                    className="rounded-md w-full object-cover"
                                    src={selectedRetweetImage}
                                    alt="" />

                                <X
                                    onClick={() => setSelectedRetweetImage(null) && setRetweetImage(null)}
                                    className="text-red-600 bg-black rounded-full absolute top-2 right-2 p-1 cursor-pointer"
                                    size={24}
                                    absoluteStrokeWidth />
                            </div>
                        )
                    }

                    <div className="flex justify-between">

                        <div className="blueicons flex gap-2 text-primary items-center">
                            <label htmlFor="retweetImage" className="cursor-pointer h-full">
                                <ImagePlus absoluteStrokeWidth />
                                <input type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className='hidden'
                                    name="retweetImage"
                                    id="retweetImage" />
                            </label>
                        </div>
                        <div className="postbtn mr-1">
                            <button
                                disabled={retweetText.trim() == "" && selectedRetweetImage == null}
                                type="submit"
                                className="bg-primary px-5 md:px-6 text-center text-sm rounded-full pt-2 pb-1 md:py-2 text-white font-bold disabled:bg-primary/50 disabled:text-white/50">
                                {
                                    tweetId ? 'Retweet' : 'Post'
                                }
                            </button>
                        </div>

                    </div>


                </form>
            </div>
        </Modal>
    )
}

export default RetweetModal
