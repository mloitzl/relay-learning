import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { UserCard } from "../components/UserCard";

const HomeQuery = graphql`
  query HomeQuery {
    me {
      ...UserCard_user
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
      </Suspense>
    </div>
  );
}