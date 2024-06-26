import { useContext, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import IsAuthenticatedContext from '../contexts/IsAuthenticatedContext';

const { VITE_SERVER } = import.meta.env;

const Login = () => {

  const navigate = useNavigate();

  const { login } = useContext(IsAuthenticatedContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // setLoading(true);

    let fetch = axios.post(VITE_SERVER + "/auth/login", formData, {
      withCredentials: true,
    });

    toast.promise(fetch, {
      loading: 'Logging in...',
      success: (res) => {
        console.log(res.data);
        // setLoading(true)
        if (res.data.success) {
          login({
            username: res.data.user.username,
            _id: res.data.user._id,
            fullName: res.data.user.fullName,
            subscription: res.data.user.subscription,
            profilePicture: res.data.user.profilePicture
          })
          navigate("/")
          return "Logged in Successfully!"
        }},
        error: (err) => `Error: ${err.response ? err.response.data.message.toString() : err.toString()}`,
    });
  };


  return (
    <main className='bg-black min-h-screen'>
      <div className="flex flex-col mx-auto md:pt-12 lg:flex-row lg:pt-28 max-w-3xl xl:max-w-4xl ">
        <div className="m-12">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white h-12 md:h-20 lg:h-44 xl:h-60"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        </div>
        <div className="flex flex-col lg:mt-8">
          <div className="mx-12 text-white text-3xl lg:text-2xl font-medium">
            Log in to 𝕏
          </div>
          <form onSubmit={handleLogin} 
          className='mx-12 my-8'>
            <input
              className='w-full px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
              type="text" name="username" id="username"
              autoFocus
              autoComplete='false'
              placeholder='Enter your username' 
              onChange={(e) => onChangeHandler(e)}
              required />
            <input
              className='w-full mt-4 px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
              type="password" name="password" id="password"
              autoComplete='false'
              placeholder='Enter your password'
              onChange={(e) => onChangeHandler(e)}
              required />

            <button className='w-full mt-4 px-4 p-2 rounded-full bg-stone-20 bg-primary text-black font-medium hover:bg-primary/85' type="submit">
              Log in
            </button>
            <p className="text-stone-500 mt-6 text-center">
              Don't have an account? <Link to="/register" className='text-primary'>Register</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
