import { useFragment, graphql } from "react-relay";
import type { Post_post$key } from "../__generated__/Post_post.graphql";
import { UserCard } from "./UserCard";

const PostFragment = graphql`
  fragment Post_post on Post
  @argumentDefinitions(showDetails: { type: "Boolean!", defaultValue: true }) {
    id
    title @skip(if: $showDetails)
    body @include(if: $showDetails)
    createdAt
    author {
      ...UserCard_user
    }
  }
`;

interface PostProps {
  post: Post_post$key;
}

export function Post({ post }: PostProps) {
  const data = useFragment(PostFragment, post);

  return (
    <article
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}
    >
      <h3>{data.title}</h3>
      <p>{data.body}</p>
      <small>{new Date(data.createdAt).toLocaleDateString()}</small>
      <div style={{ marginTop: "1rem" }}>
        <h4>By:</h4>
        <UserCard user={data.author} />
      </div>
    </article>
  );
}
