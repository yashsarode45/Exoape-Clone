import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
const NotSupported = () => {
  return (
    <div className="fixed space-y-3 top-0 left-0 flex flex-col h-screen w-screen items-center text-center justify-center bg-black text-white text-lg font-bold p-8">
      Hi!
      <br />
      This viewport is not yet supported.<br></br> I'll be adding the support
      soon.
      <div>
        Please check on a landscape viewport. <br />
        Thanks!
      </div>
      <div className=" flex gap-6">
        <Link to={"https://github.com/yashsarode45"} target="blank">
          <FaGithub className=" w-[6.5vw] h-[10vw] text-white" />
        </Link>
        <Link to={"https://www.linkedin.com/feed/"} target="blank">
          <FaLinkedin className="  w-[6.5vw] h-[10vw] text-white" />
        </Link>
      </div>
    </div>
  );
};

export default NotSupported;
