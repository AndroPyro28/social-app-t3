import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FollowingTweets from "~/components/FollowingTweets";
import NewTweetForm from "~/components/NewTweetForm";
import RecentTweets from "~/components/RecentTweets";
import { io, type Socket } from "socket.io-client";

import type {
  NextApiResponseWithSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from "../types/socket_custom.types";

const Home: NextPage = () => {
  const TABS = ["recent", "following"] as const;
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("recent");

  const array = [...TABS];
  const session = useSession();
  
 useEffect(() => {
    void fetch("/api/socket");
    const socket = io({
      path: "/api/socket",
      closeOnBeforeunload: false
      })
      socket.emit('hello', 'andro----------------------')
  
  return () => {
    if(socket) {
      socket.disconnect();
    }
  }
}
  ,[])

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>

        {session.status == "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => (
              <button
                className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 capitalize ${
                  tab === selectedTab
                    ? "border-b-4 border-b-blue-500 font-bold"
                    : ""
                }`}
                key={tab}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>
      <NewTweetForm />
      
      {
        selectedTab === 'recent' ? <RecentTweets/> : <FollowingTweets/> 
      }
    </>
  );
};

export default Home;
