import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import Navbar from "../components/Navbar";
import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-20 grid grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="relative">
              <div className="h-14 bg-gray-300 rounded-t-lg"></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <img
                  src="/default-avatar.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
              </div>
            </div>
            <div className="pt-12 pb-4 px-4 text-center">
              <h2 className="font-semibold">
                Welcome,{" "}
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "User"}
                !
              </h2>
              <p className="text-sm text-gray-500 mt-1">Add a photo</p>
            </div>
            <div className="border-t px-4 py-4">
              <div className="text-sm">
                <p className="flex justify-between text-gray-600 mb-2">
                  Profile views <span className="text-blue-600">27</span>
                </p>
                <p className="flex justify-between text-gray-600">
                  Post impressions <span className="text-blue-600">144</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6">
          {/* Post Creation Card */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center space-x-4">
              <img
                src="/default-avatar.png"
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <input
                type="text"
                placeholder="Start a post"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Posts Feed */}
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow mb-4">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img
                    src={post.authorImage}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-gray-500 text-sm">{post.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-800">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="mt-4 rounded-lg w-full"
                  />
                )}
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <HandThumbUpIcon className="w-5 h-5 mr-2" /> Like
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <ChatBubbleOvalLeftIcon className="w-5 h-5 mr-2" /> Comment
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <ShareIcon className="w-5 h-5 mr-2" /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Latest News</h2>
            {news.map((item, index) => (
              <div key={index} className="mb-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const posts = [
  {
    author: "John Doe",
    authorImage: "/default-avatar.png",
    timestamp: "2h ago",
    content:
      "Excited to announce that I've joined HireFlow as a Senior Developer! Looking forward to this new journey.",
    image: "/office-image.jpg",
  },
  {
    author: "Jane Smith",
    authorImage: "/default-avatar.png",
    timestamp: "5h ago",
    content:
      "Just completed a major project using React and Tailwind CSS. The results are amazing!",
  },
];

const news = [
  {
    title: "Tech hiring continues to grow in 2024",
    time: "3h ago",
  },
  {
    title: "New features launched on HireFlow",
    time: "5h ago",
  },
  {
    title: "Remote work trends in software development",
    time: "1d ago",
  },
];

export default Home;
