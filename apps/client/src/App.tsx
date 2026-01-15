import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <div>
        <h1>Welcome to Relay Learning</h1>
        <p>Setup complete! Ready to start Week 1.</p>
      </div>
    </Suspense>
  );
}