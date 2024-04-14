import { BadgeCheck } from "lucide-react";

const RightSidebar = () => {
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

            <ul className="flex flex-col text-lg space-y-0 mt-4 w-full mb-4">
              <li className="flex justify-between gap-3 ml-2 lg:ml-0 w-full  hover:cursor-pointer rounded-full transition-all duration-200">
                <div className="flex gap-3">
                  <img src='https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/k3inrajwwhjzwvmcq1hd.jpg' className='h-10 w-10 rounded-full object-cover' />
                  <div className='text-sm'>
                    <span className="hidden lg:flex line-clamp-1 text-nowrap">Elon Musk <BadgeCheck className="inline ml-1 self-center text-black bg-yellow-500 rounded-full" size={16} /> </span>
                    <p className="hidden lg:block text-stone-500">@elon.musk</p>
                  </div>
                </div>
                <div className="self-center">
                  <button className="border border-stone-700 px-4 py-0.5 rounded-full text-sm bg-stone-200 text-black font-medium">
                    Follow
                  </button>
                </div>
              </li>
            </ul>

            <ul className="flex flex-col text-lg space-y-0 mt-4 w-full mb-4">
              <li className="flex justify-between gap-3 ml-2 lg:ml-0 w-full  hover:cursor-pointer rounded-full transition-all duration-200">
                <div className="flex gap-3">
                  <img src='https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/k3inrajwwhjzwvmcq1hd.jpg' className='h-10 w-10 rounded-full object-cover' />
                  <div className='text-sm'>
                    <span className="hidden lg:flex line-clamp-1 text-nowrap">Elon Musk <BadgeCheck className="inline ml-1 self-center text-black bg-yellow-500 rounded-full" size={16} /> </span>
                    <p className="hidden lg:block text-stone-500">@elon.musk</p>
                  </div>
                </div>
                <div className="self-center">
                  <button className="border border-stone-700 px-4 py-0.5 rounded-full text-sm bg-stone-200 text-black font-medium">
                    Follow
                  </button>
                </div>
              </li>
            </ul>

            <ul className="flex flex-col text-lg space-y-0 mt-4 w-full mb-4">
              <li className="flex justify-between gap-3 ml-2 lg:ml-0 w-full  hover:cursor-pointer rounded-full transition-all duration-200">
                <div className="flex gap-3">
                  <img src='https://res.cloudinary.com/dd8msdb9a/image/upload/v1712702220/Userimages/k3inrajwwhjzwvmcq1hd.jpg' className='h-10 w-10 rounded-full object-cover' />
                  <div className='text-sm'>
                    <span className="hidden lg:flex line-clamp-1 text-nowrap">Praveen Patel <BadgeCheck className="inline ml-1 self-center text-black bg-primary rounded-full" size={16} /> </span>
                    <p className="hidden lg:block text-stone-500">@elon.musk</p>
                  </div>
                </div>
                <div className="self-center">
                  <button className="border border-stone-700 px-4 py-0.5 rounded-full text-sm bg-stone-200 text-black font-medium">
                    Follow
                  </button>
                </div>
              </li>
            </ul>


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
