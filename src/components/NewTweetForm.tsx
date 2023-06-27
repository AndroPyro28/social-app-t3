import React, { FormEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import ProfileImage from "./ProfileImage";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const Form = () => {
  const [content, setContent] = useState("");
  const session = useSession();
  const user = session.data?.user;
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const context = api.useContext()
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [content]);

  const {mutate: createTweet} = api.tweet.create.useMutation({
    onMutate: () => {
      setContent(prev => '')
    },
    onSettled: () => {
      
    },
    onError: () => {

    },
    onSuccess: (newTweet) => {
      if(session.status != 'authenticated' || !user) return;


      context.tweet.infiniteTweet.setInfiniteData({}, oldData => {
        
        if(oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe:false,
          user:{
            id: user?.id ?? '',
            name: user?.name ?? '',
            image: user?.image ?? '',
          }
        }

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweet: [newCacheTweet, ...oldData.pages[0].tweet]
            }
          ],
          ...oldData.pages.slice(1)
        }
      })
    }
  });

  const handleCreateTweet = (e: FormEvent) => {
    e.preventDefault();
    if(!content) return;
    createTweet({content});
  }

  const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
    if (!textArea) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-3" onSubmit={handleCreateTweet}>
      <div className="flex gap-4">
        <ProfileImage src={user?.image} />
        <textarea
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none max-h-[10em]"
          ref={inputRef}
          value={content}
          style={{ height: 0 }}
          placeholder="What's happening"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <Button type="submit" className="self-end mb-2">Post</Button>
    </form>
  );
};

const NewTweetForm = () => {
  const session = useSession();
  if (session.status === "unauthenticated") return null;
  return <Form />;
};
export default NewTweetForm;