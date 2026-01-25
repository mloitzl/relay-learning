import { useQueryLoader, graphql } from "react-relay";
import type { PostDetailContainerQuery as PostDetailContainerQueryType } from "../__generated__/PostDetailContainerQuery.graphql.ts";
import { PostDetail } from "./PostDetail.tsx";
import { Suspense, useEffect } from "react";

const PostDetailContainerQuery = graphql`
  query PostDetailContainerQuery($postId: ID!) {
    node(id: $postId) {
      ... on Post {
        id
        title
        body
        createdAt
        author {
          ...UserCard_user
        }
      }
    }
  }
`;

interface PostDetailContainerProps {
  postId: string;
}

export function PostDetailContainer({ postId }: PostDetailContainerProps) {
  const [preloadedQuery, loadQuery] =
    useQueryLoader<PostDetailContainerQueryType>(PostDetailContainerQuery);

  useEffect(() => {
    loadQuery({ postId });
  }, [postId, loadQuery]);

  return (
    <Suspense fallback={<div>Loading post...</div>}>
      {preloadedQuery != null ? (
        <PostDetail preloadedQuery={preloadedQuery} />
      ) : null}
    </Suspense>
  );
}
