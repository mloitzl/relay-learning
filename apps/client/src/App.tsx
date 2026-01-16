import { Suspense } from 'react';
import { HomePage } from './pages/Home';

export default function App() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <HomePage />
    </Suspense>
  );
}