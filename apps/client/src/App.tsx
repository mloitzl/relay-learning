import { Suspense, useState } from "react";
import { HomePage } from "./pages/Home";
import { UserProfile } from "./pages/UserProfile";
import { PostList } from "./components/PostList";
import { PostDetailContainer } from "./pages/PostDetailContainer";

type Route =
  | { type: "home" }
  | { type: "profile" }
  | { type: "post-list" }
  | { type: "post-detail"; postId: string };

export default function App() {
  const [route, setRoute] = useState<Route>({ type: "home" });

  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <nav
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setRoute({ type: "home" })}
          disabled={route.type === "home"}
        >
          Home
        </button>
        <button
          onClick={() => setRoute({ type: "profile" })}
          disabled={route.type === "profile"}
        >
          User Profile
        </button>
        <button
          onClick={() => setRoute({ type: "post-list" })}
          disabled={route.type === "post-list"}
        >
          Post List
        </button>
      </nav>
      <div>
        {route.type === "home" && <HomePage />}
        {route.type === "profile" && <UserProfile userId="user:1" />}
        {route.type === "post-list" && (
          <PostList
            onSelectPost={(postId) => setRoute({ type: "post-detail", postId })}
          />
        )}
        {route.type === "post-detail" && (
          <PostDetailContainer postId={route.postId} />
        )}
      </div>
    </Suspense>
  );
}
