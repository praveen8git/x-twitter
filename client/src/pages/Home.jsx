import axios from "axios";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useImageUploader } from "../hooks/useImageUploader";
import { ImagePlus, X, Earth } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { RightSidebar, Sidebar, Tweet } from "../components";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";

const { VITE_SERVER } = import.meta.env;

const Home = () => {
  const { login, user } = useContext(IsAuthenticatedContext);

  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Post a tweet ------>
  const submitPost = async (e) => {
    e.preventDefault();

    let imageUrl = image !== null ? await useImageUploader(image) : "";

    let postData = {
      text: postText,
      image: imageUrl
    }

    let fetch = axios.post(VITE_SERVER + "/api/tweet", postData, {
      withCredentials: true,
    });

    toast.promise(fetch, {
      loading: 'Tweeting...',

      success: (res) => {
        if (res.status === 201) {
          console.log(res.data);
          setPostText(""); // empty textfield
          setImage(null); // empty image
          setSelectedImage(null); // empty image preview
          fetchTweets();
          // Append the new tweet to the beginning of the tweets array
          //setTweets([res.data, ...tweets]); // not returning populated data
          return "Tweeted!"
        }
      },

      error: (err) => `Failed: ${err.response ? err.response.data.message.toString() : err.toString()}`,
    });
  }

  // Delete handler for tweets
  const deleteTweetFromHome = (tweetId) => {
    setTweets(tweets.filter(tweet => tweet._id !== tweetId));
};

  // Fetch all tweets ------>
  const [tweets, setTweets] = useState([]);
  const fetchTweets = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/api/all-tweets`, {
        withCredentials: true,
      });
      setTweets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [])

  if (user !== null) return (
    <main className='relative flex md:flex-row-reverse lg:flex-row justify-cente bg-black w-full'>
      <div className="sticky top-0 max-w-[300px] min-h-screen max-h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full max-w-2xl border-[1px] border-x-stone-800 border-y-black ">
        {/* Post a tweet section */}
        <div className="flex py-5 px-3 border-[1px] border-x-black border-t-black border-b-stone-800">
          <Link to={"/profile/" + user?.username} className="w-16 h-fit">
            <img className="h-12 w-12 rounded-full object-cover" src={
              user?.profilePicture === "" ?
                "https://res.cloudinary.com/diwafhioq/image/upload/e_brightness:-10/wvxd8kovevbdgpsb1p3a.jpg"
                : user.profilePicture
            } alt="DP" />
          </Link>
          <form onSubmit={submitPost} className="flex flex-col mx-3 w-full">

            <TextareaAutosize
              className="bg-black text-white outline-none w-full h-10 text-xl placeholder:text-stone-500 resize-none"
              placeholder="What is happening ?!"
              onChange={(e) => { setPostText(e.target.value) }}
              value={postText}
              required
              name="text"
              id="text" />

            <div className="flex w-fit pt-1 px-2 text-primary text-sm mt-3 gap-x-2 font-medium hover:bg-primary/10 rounded-full">
              <Earth size={15} className="self-center bg-primary text-black rounded-full" /> <span className="self-center font-semibold">Everyone can reply</span>
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
                  disabled={postText.trim() == "" && selectedImage == null}
                  type="submit"
                  className="bg-primary px-5 md:px-6 text-center text-sm rounded-full pt-2 pb-1 md:py-2 text-white font-bold disabled:bg-primary/50 disabled:text-white/50">
                  Post
                </button>
              </div>

            </div>


          </form>
        </div>

        {/* Tweets section */}
        {tweets.map(tweet => (
          <Tweet key={tweet._id} {...tweet} onDelete={deleteTweetFromHome} />
        ))}

      </div>

      <RightSidebar />
    </main>
  )
}

export default Home
