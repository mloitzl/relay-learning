import { usePreloadedQuery, graphql } from "react-relay";
import type { PostDetailQuery as PostDetailQueryType } from "../__generated__/PostDetailQuery.graphql.ts";
import type { PreloadedQuery } from "react-relay";
import { UserCard } from "../components/UserCard.tsx";

const PostDetailQuery = graphql`
  query PostDetailQuery($postId: ID!) {
    node(id: $postId) {
      ... on Post {
        id
        title
        body
        author {
          ...UserCard_user
        }
      }
    }
  }
`;

interface PostDetailProps {
  preloadedQuery: PreloadedQuery<PostDetailQueryType>;
}
export function PostDetail({ preloadedQuery }: PostDetailProps) {
  const data = usePreloadedQuery<PostDetailQueryType>(
    PostDetailQuery,
    preloadedQuery,
  );

  if (data.node == null) {
    return <div>Post not found</div>;
  }

  const post = data.node;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2 rem" }}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      {post.author && <UserCard user={post.author} />}
    </div>
  );
}
