import { useFragment, graphql } from 'react-relay';
import type { UserCard_user$key } from '../__generated__/UserCard_user.graphql';

const UserCardFragment = graphql`
  fragment UserCard_user on User {
    id
    name
    email
  }
`;

interface UserCardProps {
  user: UserCard_user$key;
}

export function UserCard({ user }: UserCardProps) {
const data = useFragment(UserCardFragment, user)

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>{data.name}</h3>
      <p>{data.email}</p>
    </div>
  );
}