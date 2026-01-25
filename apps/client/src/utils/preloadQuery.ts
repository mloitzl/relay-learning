import { graphql, loadQuery } from "react-relay";
import environment from "../relay/environment";

const PostDetailQuery = graphql`
  query preloadQuery_PreloadPostDetailQuery($postId: ID!) {
    node(id: $postId) {
      ... on Post {
        id
        title
        body
        createdAt
        author {
          id
          name
          email
        }
      }
    }
  }
`;

export function preloadPostDetailQuery(postId: string) {
  return loadQuery(environment, PostDetailQuery, { postId });
}
