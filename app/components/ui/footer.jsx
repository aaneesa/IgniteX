import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="text-gray-400 py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-32 border-b border-white pb-4 mb-8">

          {/* logo and text */}
          <div className="col-span-1 md:mb-0 mb-8">
            <div className="text-gray-300 text-2xl font-bold mb-4 ">
              IgniteX
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              IgniteX is an AI-powered career coach built to guide you every step of the way.
It helps you grow the right skills, plan your path, and stay career-ready.
With smart, personalized support, IgniteX turns your goals into real outcomes.
            </p>
          </div>

          {/* pages links */}
          <div className="col-span-1 md:ml-6 md:mb-0 mb-8">
            <h4 className="text-lg font-semibold mb-4 ">
              Pages
            </h4>
            <div className="flex flex-wrap text-sm text-gray-400">
              <ul className="w-1/2 space-y-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white flex items-center"
                  >
                    <span className="mr-2 text-white">›</span>Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="hover:text-white flex items-center"
                  >
                    <span className="mr-2 text-white">›</span>Learning Plan
                  </Link>
                </li>
              </ul>
              <ul className="w-1/2 space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white flex items-center"
                  >
                    <span className="mr-2 text-white">›</span>Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview"
                    className="hover:text-white flex items-center"
                  >
                    <span className="mr-2 text-white">›</span>Practice
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            {/* Social Media Section */}
            <h4 className="text-lg font-semibold mb-3 ">
              Social Media
            </h4>
            <div className="flex flex-wrap items-center text-gray-400 gap-4 mb-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-[#008080] text-xl"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#0A66C2] text-xl"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#E4405F] text-xl"
              >
                <FaInstagram />
              </a>
            </div>
            <div className="flex flex-col gap-1 text-gray-400 text-sm mt-2">
              <a
                href="mailto:hello@gurukul2_0.in"
                className="flex items-center gap-2 hover:text-white"
              >
                <FaEnvelope className="text-base" /> hello@IgniteX.in
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-300">
          Copyright By @ IgniteX - {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;