import { useLazyLoadQuery, graphql } from "react-relay";
import type { UserProfileQuery } from "../__generated__/UserProfileQuery.graphql";
import { UserCard } from "../components/UserCard";
import { Post } from "../components/Post";

const UserProfileQuery = graphql`
  query UserProfileQuery($userId: ID!) {
    node(id: $userId) {
      ... on User {
        ...UserCard_user
        posts(first: 10) {
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    }
  }
`;

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const data = useLazyLoadQuery<UserProfileQuery>(UserProfileQuery, { userId });

  if (!data.node) {
    return <div>User not found</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <UserCard user={data.node} />
      <h2>Posts</h2>
      {data.node.posts.edges.map(({ node }) => (
        <Post key={node.id} post={node} />
      ))}
    </div>
  );
}
