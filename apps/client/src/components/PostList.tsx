import { useLazyLoadQuery, graphql } from "react-relay";
import type { PostListQuery } from "../__generated__/PostListQuery.graphql.ts";
import { preloadPostDetailQuery } from "../utils/preloadQuery";

const PostListQuery = graphql`
  query PostListQuery {
    posts(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

interface PostListProps {
  onSelectPost: (postId: string) => void;
}

export function PostList({ onSelectPost }: PostListProps) {
  const data = useLazyLoadQuery(PostListQuery);

  const handlePostHover = (postId: string) => {
    preloadPostDetailQuery(postId);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h2>All Posts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.posts.edges.map(({ node }) => (
          <li
            key={node.id}
            onMouseEnter={() => handlePostHover(node.id)}
            onClick={() => onSelectPost(node.id)}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {node.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
