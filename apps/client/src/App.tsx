import { Suspense, useState } from "react";
import { HomePage } from "./pages/Home";
import { UserProfile } from "./pages/UserProfile";

export default function App() {
  const [route, setRoute] = useState<"home" | "profile">("home");

  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <button onClick={() => setRoute("home")} disabled={route === "home"}>
          Home
        </button>
        <button onClick={() => setRoute("profile")} disabled={route === "profile"}>
          User Profile
        </button>
      </nav>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        {route === "home" && <HomePage />}

        {route === "profile" && <UserProfile userId="user:1" />}
      </nav>
    </Suspense>
  );
}
