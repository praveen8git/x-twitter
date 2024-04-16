import { useContext, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import IsAuthenticatedContext from '../contexts/IsAuthenticatedContext';

const { VITE_SERVER } = import.meta.env;

const Register = () => {

  const navigate = useNavigate();

  const { login } = useContext(IsAuthenticatedContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // form validation
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let tempErrors = {};

    // Check fullName
    if (!formData.fullName || formData.fullName.trim() === "") {
      tempErrors.fullName = "Full name is required.";
    }

    // Check username
    if (!formData.username || formData.username.trim() === "") {
      tempErrors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      tempErrors.username = "Username must not contain whitespace or special characters.";
    }

    // Check email
    if (!formData.email || formData.email.trim() === "") {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid.";
    }

    // Check password
    if (!formData.password || formData.password.trim() === "") {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
    }

    // Check password confirmation
    if (formData.password !== formData.passwordConfirm) {
      tempErrors.passwordConfirm = "Passwords do not match.";
    }

    // setErrors(tempErrors);

    // Return true if there are no errors
    // return Object.keys(tempErrors).length === 0;
    return tempErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // setLoading(true);
    if (!validateForm()) {
      // Validation failed, do not proceed with form submission
      // Display toast notifications for each error
      Object.entries(errors).forEach(([key, value]) => {
        toast.error(value);
      });
      return;
    }

    let fetch = axios.post(VITE_SERVER + "/auth/register", formData, {
      withCredentials: true,
    });

    toast.promise(fetch, {
      loading: 'Registering...',
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
          return "Registered"
        }
      },
      error: (err) => `Error: ${err.response ? err.response.data.message.toString() : err.toString()}`,
    });
  };

  return (
    <main className='bg-black min-h-screen'>
      <div className="flex flex-col mx-auto md:pt-12 lg:flex-row lg:pt-28 max-w-3xl xl:max-w-4xl ">
        <div className="m-12">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white h-12 md:h-20 lg:h-44 xl:h-60"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        </div>
        <div className="flex flex-col">
          <div className="mx-12 mb-8 text-white text-5xl lg:text-6xl leading-snug font-serif font-bold">
            Happening Now!
          </div>
          <div className="mx-12 text-white text-3xl lg:text-2xl font-medium">
            Join 𝕏.
          </div>
          <form onSubmit={handleRegister}
            className='mx-12 my-8'>
            <input
              className='w-full px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
              type="text" name="fullName" id="fullName"
              autoFocus
              autoComplete='false'
              placeholder='Enter your full name'
              onChange={(e) => onChangeHandler(e)}
              required />

            <div className="flex flex-col md:flex-row md:gap-4">
              <input
                className='w-full mt-4 px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                type="text" name="username" id="username"
                autoComplete='false'
                placeholder='Enter your username'
                onChange={(e) => onChangeHandler(e)}
                required />

              <input
                className='w-full mt-4 px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                type="email" name="email" id="email"
                autoComplete='false'
                placeholder='Enter your email'
                onChange={(e) => onChangeHandler(e)}
                required />

            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <input
                className='w-full mt-4 px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                type="password" name="password" id="password"
                autoComplete='false'
                placeholder='Enter your password'
                onChange={(e) => onChangeHandler(e)}
                required />

              <input
                className='w-full mt-4 px-4 p-2 rounded-full bg-stone-300/10 border-2 border-stone-800 hover:border-primary focus-visible:outline-none placeholder:text-stone-500'
                type="password" name="passwordConfirm" id="passwordConfirm"
                autoComplete='false'
                placeholder='Confirm your password'
                onChange={(e) => onChangeHandler(e)}
                required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className='w-full mt-4 px-4 p-2 rounded-full bg-stone-20 bg-primary text-black font-medium hover:bg-primary/85 disabled:opacity-50' >
              Register
            </button>
            <p className="text-stone-500 mt-6 text-center">
              Already have an account? <Link className='text-primary' to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}



export default Register
