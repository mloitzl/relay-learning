import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { UserCard } from "../components/UserCard";
import { Post } from "../components/Post";

const HomeQuery = graphql`
  query HomeQuery {
    me {
      ...UserCard_user
      posts(first: 5) {
        edges {
          node {
            ...Post_post
          }
        }
      }
    }
  }
`;

export function HomePage() {
  const queryRef = useLazyLoadQuery(HomeQuery, {});
  return (
    <div>
      <h1>Home Page</h1>
      <Suspense fallback={<div>Loading user data...</div>}>
        {/* @ts-expect-error Relay types */}
        <UserCard user={queryRef.me} />
        <h2>Posts</h2>
        {queryRef.me.posts.edges.map(({ node }) => (
          <Post key={node.id} post={node} />
        ))}
      </Suspense>
    </div>
  );
}