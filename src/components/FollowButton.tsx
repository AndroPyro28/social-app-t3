import { useSession } from "next-auth/react";
import Button from "./Button";

type FollowButtonProps = {
    isFollowing: boolean;
    userId: string;
    isLoading: boolean;
    onClick: () => void;
  }
  
  const FollowButton = ({userId, isFollowing, onClick}: FollowButtonProps) => {
    const session = useSession();
    
    if(session.status === 'unauthenticated' || session.data?.user.id == userId) return null;

    return <Button onClick={onClick} small gray={isFollowing}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
    
  }

  export default FollowButton