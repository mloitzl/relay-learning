# React Relay Mastery Plan: 12-Week Course (Monorepo Edition with pnpm)

**Start Date:** 2026-01-13  
**Completion Target:** ~2026-04-06  
**Total Time Investment:** ~72 hours (~6 hours/week)  
**Framework:** Vite + React 18 + TypeScript + Relay + pnpm Monorepo  
**GitHub User:** mloitzl  

---

## Table of Contents
1. [Monorepo Structure](#monorepo-structure)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Complete Monorepo Configuration](#complete-monorepo-configuration)
4. [Week-by-Week Learning Plan](#week-by-week-learning-plan)
5. [Checkpoint Rubrics](#checkpoint-rubrics)
6. [Testing Strategy](#testing-strategy)
7. [Common Pitfalls & Debugging](#common-pitfalls--debugging)
8. [Capstone Assignment](#capstone-assignment)
9. [Cheat Sheet](#cheat-sheet)

---

## Monorepo Structure

This is the **perfect setup** for learning Relay—server and client in one repo, shared utilities, easy testing.

```
relay-learning/ (monorepo root)
├── pnpm-workspace.yaml          # pnpm monorepo config
├── package.json                 # Root package (shared deps)
├── turbo.json                   # Optional: build orchestration
├── .gitignore
├── .editorconfig
│
├── apps/
│   ├── server/                  # GraphQL Yoga server
│   │   ├── src/
│   │   │   ├── schema.ts        # GraphQL schema
│   │   │   ├── index.ts         # Server entry
│   │   │   └── resolvers/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── client/                  # Vite + React + Relay
│       ├── src/
│       │   ├── relay/
│       │   │   ├── environment.ts
│       │   │   └── __generated__/  (auto-generated artifacts)
│       │   ├── components/
│       │   │   ├── UserCard.tsx
│       │   │   ├── Post.tsx
│       │   │   └── ...
│       │   ├── pages/
│       │   ├── mutations/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── relay.config.js
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── vitest.config.ts
│
├── packages/                    # Optional: shared code
│   ├── graphql-types/           # Shared GraphQL types
│   ├── testing-utils/           # Mock data, test helpers
│   └── hooks/                   # Shared custom hooks
│
└── docs/                        # Learning materials
    ├── SETUP.md
    ├── WEEK-1.md
    └── ...
```

---

## Prerequisites & Setup

**Before starting:**
- ✅ Node.js v18+
- ✅ pnpm v8+ (`npm install -g pnpm`)
- ✅ Git
- ✅ GitHub account (mloitzl)
- ✅ iPad Pro + Safari (or any browser for Codespaces)

**Verify pnpm:**
```bash
pnpm --version  # Should be v8.0.0 or higher
```

---

## Complete Monorepo Configuration

### **Step 1: Create Monorepo Repository on GitHub**

```bash
# Create new repo on github.com/mloitzl
# Name: relay-learning
# Description: Monorepo for learning React Relay (server + client)
# Public repo
# No README/gitignore (we'll create them)
```

### **Step 2: Clone & Initialize Monorepo Structure**

```bash
# Clone locally (or in Codespace)
git clone https://github.com/mloitzl/relay-learning.git
cd relay-learning

# Initialize as monorepo
pnpm init -y
```

### **Step 3: Create pnpm-workspace.yaml**

**File: `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### **Step 4: Root package.json Configuration**

**File: `package.json`** (at monorepo root)

```json
{
  "name": "relay-learning",
  "version": "1.0.0",
  "description": "12-week React Relay mastery learning plan (monorepo)",
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --filter ./apps/* build",
    "relay": "pnpm --filter ./apps/client relay",
    "relay:watch": "pnpm --filter ./apps/client relay:watch",
    "test": "pnpm -r --parallel test",
    "test:ui": "pnpm --filter ./apps/client test:ui",
    "lint": "pnpm -r --parallel lint",
    "type-check": "pnpm -r --parallel type-check",
    "clean": "pnpm -r --parallel clean && pnpm -r exec rm -rf node_modules .turbo",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "prepare": "husky install"
  },
  "devDependencies": {
    "prettier": "^3.1.0",
    "turbo": "^1.10.0"
  }
}
```

### **Step 5: Create turbo.json (Optional but Recommended)**

**File: `turbo.json`** (for build orchestration)

```json
{
  "globalDependencies": ["package.json", "pnpm-workspace.yaml"],
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "relay": {
      "outputs": ["src/__generated__/**"],
      "cache": false
    },
    "test": {
      "cache": false
    }
  }
}
```

### **Step 6: Create .gitignore**

**File: `.gitignore`**

```
# Dependencies
node_modules/
pnpm-lock.yaml

# Build outputs
dist/
build/
.turbo/

# Relay artifacts
src/__generated__/

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
.nyc_output/
coverage/

# OS
Thumbs.db
.DS_Store
```

### **Step 7: Create .editorconfig**

**File: `.editorconfig`**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx,json}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### **Step 8: Create apps/server directory**

```bash
mkdir -p apps/server/src/resolvers
cd apps/server
pnpm init -y
```

---

## Server Package Configuration

**File: `apps/server/package.json`**

```json
{
  "name": "@relay-learning/server",
  "version": "1.0.0",
  "description": "GraphQL Yoga server for Relay learning",
  "type": "module",
  "scripts": {
    "start": "node -r tsx src/index.ts",
    "dev": "node --watch -r tsx src/index.ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "graphql": "^16.8.0",
    "graphql-yoga": "^5.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.3.0"
  }
}
```

**File: `apps/server/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

**File: `apps/server/src/schema.ts`**

```typescript
import { createSchema } from 'graphql-yoga';

export const schema = createSchema({
  typeDefs: `
    type Query {
      node(id: ID!): Node
      me: User
      posts(first: Int = 10, after: String): PostConnection!
    }

    interface Node {
      id: ID!
    }

    type User implements Node {
      id: ID!
      name: String!
      email: String!
      posts(first: Int = 10, after: String): PostConnection!
    }

    type Post implements Node {
      id: ID!
      title: String!
      body: String!
      author: User!
      createdAt: String!
    }

    type PostConnection {
      edges: [PostEdge!]!
      pageInfo: PageInfo!
    }

    type PostEdge {
      cursor: String!
      node: Post!
    }

    type PageInfo {
      hasNextPage: Boolean!
      endCursor: String
    }

    type Mutation {
      createPost(title: String!, body: String!): CreatePostPayload!
      deletePost(id: ID!): DeletePostPayload!
    }

    type CreatePostPayload {
      post: Post
      error: String
    }

    type DeletePostPayload {
      success: Boolean!
      error: String
    }
  `,
  resolvers: {
    Query: {
      node: (_, { id }) => {
        const [type, pk] = id.split(':');
        if (type === 'user') return mockUsers.find(u => u.id === `user:${pk}`);
        if (type === 'post') return mockPosts.find(p => p.id === `post:${pk}`);
        return null;
      },
      me: () => mockUsers[0],
      posts: (_, { first = 10, after }) => {
        const startIdx = after
          ? parseInt(Buffer.from(after, 'base64').toString())
          : 0;
        const edges = mockPosts
          .slice(startIdx, startIdx + first)
          .map((post, idx) => ({
            cursor: Buffer.from((startIdx + idx).toString()).toString('base64'),
            node: post,
          }));
        return {
          edges,
          pageInfo: {
            hasNextPage: startIdx + first < mockPosts.length,
            endCursor:
              edges.length > 0 ? edges[edges.length - 1].cursor : null,
          },
        };
      },
    },
    User: {
      posts: (user, { first = 10, after }) => {
        const userPosts = mockPosts.filter(p => p.author.id === user.id);
        const startIdx = after
          ? parseInt(Buffer.from(after, 'base64').toString())
          : 0;
        const edges = userPosts
          .slice(startIdx, startIdx + first)
          .map((post, idx) => ({
            cursor: Buffer.from((startIdx + idx).toString()).toString('base64'),
            node: post,
          }));
        return {
          edges,
          pageInfo: {
            hasNextPage: startIdx + first < userPosts.length,
            endCursor:
              edges.length > 0 ? edges[edges.length - 1].cursor : null,
          },
        };
      },
    },
    Mutation: {
      createPost: (_, { title, body }) => {
        const post = {
          id: `post:${Math.random().toString(36).slice(2)}`,
          title,
          body,
          author: mockUsers[0],
          createdAt: new Date().toISOString(),
        };
        mockPosts.unshift(post);
        return { post, error: null };
      },
      deletePost: (_, { id }) => {
        const idx = mockPosts.findIndex(p => p.id === id);
        if (idx > -1) {
          mockPosts.splice(idx, 1);
          return { success: true, error: null };
        }
        return { success: false, error: 'Not found' };
      },
    },
  },
});

// Mock data (persists during server lifetime)
const mockUsers = [
  {
    id: 'user:1',
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    id: 'user:2',
    name: 'Bob',
    email: 'bob@example.com',
  },
];

const mockPosts = [
  {
    id: 'post:1',
    title: 'Getting Started with Relay',
    body: 'Relay is a JavaScript framework for building data-driven React applications with GraphQL.',
    author: mockUsers[0],
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'post:2',
    title: 'GraphQL Fundamentals',
    body: 'GraphQL is a query language for APIs. Learn the basics of types, queries, and mutations.',
    author: mockUsers[1],
    createdAt: '2026-01-05T14:30:00Z',
  },
  {
    id: 'post:3',
    title: 'Advanced Relay Patterns',
    body: 'Learn advanced patterns for managing complex data flows with Relay.',
    author: mockUsers[0],
    createdAt: '2026-01-10T09:15:00Z',
  },
];
```

**File: `apps/server/src/index.ts`**

```typescript
import { createServer } from 'http';
import { schema } from './schema';

const PORT = process.env.PORT || 4000;

const server = createServer(schema);

server.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
```

---

## Client Package Configuration

```bash
cd apps
pnpm create vite client -- --template react-ts
cd client
```

**File: `apps/client/package.json`** (update existing)

```json
{
  "name": "@relay-learning/client",
  "version": "1.0.0",
  "description": "Vite + React + Relay client app",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "relay": "relay-compiler",
    "relay:watch": "relay-compiler --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-relay": "^16.0.0",
    "relay-runtime": "^16.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.1.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "relay-compiler": "^16.0.0",
    "relay-test-utils": "^16.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

**File: `apps/client/relay.config.js`**

```javascript
module.exports = {
  src: './src',
  schema: './schema.graphql',
  language: 'typescript',
  eagerEsModules: true,
  artifactDirectory: './src/__generated__',
};
```

**File: `apps/client/vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Important for iPad/remote access
  },
});
```

**File: `apps/client/vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
});
```

**File: `apps/client/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowJs": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",

    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**File: `apps/client/src/relay/environment.ts`**

```typescript
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const SERVER_URL =
  process.env.VITE_GRAPHQL_URL || 'http://localhost:4000';

const network = Network.create(async (params, variables) => {
  console.log('Fetching:', params.name, 'Variables:', variables);

  const response = await fetch(`${SERVER_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
  }
  
  return result;
});

const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default environment;
```

**File: `apps/client/src/main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RelayEnvironmentProvider } from 'react-relay';
import environment from './relay/environment';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <App />
    </RelayEnvironmentProvider>
  </React.StrictMode>,
);
```

**File: `apps/client/src/App.tsx`**

```typescript
import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <div>
        <h1>Welcome to Relay Learning</h1>
        <p>Week 1: Set up complete! Ready to start learning.</p>
      </div>
    </Suspense>
  );
}
```

---

## Install All Dependencies

**From monorepo root:**

```bash
# Install all dependencies for all packages
pnpm install

# Verify structure
pnpm list --depth=0
```

**Expected output:**
```
relay-learning@1.0.0 /path/to/relay-learning
├── @relay-learning/client@1.0.0 (apps/client)
├── @relay-learning/server@1.0.0 (apps/server)
└── (shared devDependencies)
```

---

## Get GraphQL Schema

**From monorepo root, start server first:**

```bash
# Terminal 1: Start server
pnpm --filter @relay-learning/server dev
```

**Terminal 2: Introspect schema**

```bash
cd apps/client

# Install introspection tool
pnpm add -D get-graphql-schema

# Introspect the running server
pnpm exec get-graphql-schema http://localhost:4000/graphql > schema.graphql

# Verify schema was created
ls -lh schema.graphql
```

---

## Start Development (The Easy Way)

### **Option A: Run Everything with One Command**

```bash
# From monorepo root
pnpm dev
```

This runs:
- Server on http://localhost:4000
- Client on http://localhost:5173

**Output:**
```
> pnpm -r --parallel dev

@relay-learning/server: 🚀 GraphQL server running at http://localhost:4000/graphql
@relay-learning/client: ➜  Local: http://localhost:5173/
```

### **Option B: Run Separately (if you prefer)**

```bash
# Terminal 1: Server
pnpm --filter @relay-learning/server dev

# Terminal 2: Client
pnpm --filter @relay-learning/client dev
```

### **Option C: On iPad with Codespaces**

**Step 1: Create Codespace from monorepo**

```
1. Go to github.com/mloitzl/relay-learning
2. Click "Code" → "Codespaces" → "Create codespace on main"
3. Wait for VS Code in browser to load
```

**Step 2: In Codespace terminal**

```bash
# Monorepo auto-detects pnpm
pnpm install

# Start both server and client
pnpm dev
```

**Step 3: Expose ports in Codespaces**

- In VS Code, find **PORTS** tab (bottom panel)
- Right-click port 4000 → **"Make Public"**
- Right-click port 5173 → **"Make Public"**
- Copy both forwarded URLs

**Step 4: On iPad Safari**

Tab 1: `https://mloitzl-abc.github.dev` (client)  
Tab 2: `https://mloitzl-abc.github.dev:4000/graphql` (server)  
Tab 3: VS Code editor

---

## Monorepo Workflow for iPad Pro

### **Optimal Setup:**

```
iPad Pro Landscape:
┌─────────────────────────────────────────┐
│  VS Code (Codespaces) - Left 60%        │
├─────────────────────────────────────────┤
│ Apps/Client/Src/Components/UserCard.tsx │
│                                         │
│ [File tree] [Editor] [Code tabs]        │
└──────────────────────────┬──────────────┘
       Safari Tab 1 - Client (40%)
       http://localhost:5173
```

### **Daily Workflow:**

```bash
# Morning: Start development environment
pnpm dev

# Edit component in VS Code
# (Auto-saves, Vite HMR refreshes browser)

# Run Relay compiler
pnpm relay

# Test in browser
# (Refresh Safari)

# Commit work
git add .
git commit -m "Week 1: Fragment fundamentals"
git push
```

---

## Monorepo Commands Reference

### **Development**

```bash
# Start both server & client
pnpm dev

# Run Relay compiler
pnpm relay

# Watch Relay compiler
pnpm relay:watch

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

### **Building**

```bash
# Build client app
pnpm build

# Type-check all packages
pnpm type-check
```

### **Package-Specific Commands**

```bash
# Run command in specific package
pnpm --filter @relay-learning/server dev
pnpm --filter @relay-learning/client relay:watch

# Run in all packages
pnpm -r test
```

### **Maintenance**

```bash
# Update dependencies
pnpm update

# Clean everything
pnpm clean

# Format code
pnpm format

# Check types
pnpm type-check
```

---

## Monorepo File Structure After Setup

```
relay-learning/
├── pnpm-workspace.yaml
├── package.json (root scripts)
├── turbo.json
├── .gitignore
├── .editorconfig
├── README.md
│
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── schema.ts ✅ (GraphQL schema)
│   │   │   └── index.ts ✅ (server entry)
│   │   ├── package.json ✅
│   │   └── tsconfig.json ✅
│   │
│   └── client/
│       ├── src/
│       │   ├── relay/
│       │   │   ├── environment.ts ✅
│       │   │   └── __generated__/ (auto)
│       │   ├── components/ (will add in Week 1)
│       │   ├── pages/ (will add in Week 1)
│       │   ├── App.tsx ✅
│       │   └── main.tsx ✅
│       ├── schema.graphql ✅ (after introspection)
│       ├── relay.config.js ✅
│       ├── vite.config.ts ✅
│       ├── vitest.config.ts ✅
│       ├── tsconfig.json ✅
│       └── package.json ✅
│
├── packages/ (optional, for Week 9+)
│   ├── testing-utils/
│   └── graphql-types/
│
└── docs/ (learning materials)
    ├── SETUP.md (this file)
    ├── WEEK-1.md
    ├── WEEK-2.md
    └── ...
```

---

## Monorepo Advantages for Learning Relay

| Advantage | Benefit |
|-----------|---------|
| **Single repo** | Clone once, everything syncs |
| **Shared deps** | pnpm deduplicates node_modules (faster, smaller) |
| **Easy testing** | Mock server built-in, no external API |
| **Scale gradually** | Add packages as you learn advanced patterns |
| **IDE support** | One VS Code workspace for client + server |
| **CI/CD ready** | Single GitHub Actions workflow for whole monorepo |
| **iPad-friendly** | One Codespace to manage, both apps in tabs |

---

## Verification Checklist

Before moving to Week 1, verify:

- [ ] `pnpm --version` shows v8+
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts both server (4000) and client (5173)
- [ ] `pnpm list --depth=0` shows both packages
- [ ] `schema.graphql` file exists in `apps/client/`
- [ ] `pnpm relay` runs without errors
- [ ] http://localhost:5173 loads in browser
- [ ] http://localhost:4000/graphql loads GraphQL playground
- [ ] Both repos committed to GitHub (mloitzl/relay-learning)
- [ ] On Codespaces: ports 4000 & 5173 are Public

**Once all ✓ checkboxes, proceed to Week 1!**

---

# Week-by-Week Learning Plan

## **Week 1: Relay Fundamentals & Data Dependencies (6 hours)**

### Learning Objectives
- Understand Relay's mental model
- Set up Relay environment and basic queries
- Master fragments and colocation
- Learn useFragment hook

### Daily Breakdown

#### **Day 1-2: Relay Concepts & Setup (2.5 hours)**

**Topics:**
- What Relay is and why it exists (vs manual fetch)
- Relay's 3 core concepts: Queries, Fragments, Mutations
- Query vs. Fragment boundaries
- Colocation principle

**Resources:**
- [Relay Docs: Getting Started](https://relay.dev/docs/getting-started/)
- [Relay Docs: Thinking in Relay](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/)

**Hands-On Exercise:**
1. Verify both server and client running
2. Write introspection query manually in GraphQL Playground
3. Understand schema structure (Node interface, Connection pattern)

```bash
# Verify everything running
pnpm dev

# Check GraphQL Playground
# Visit: http://localhost:4000/graphql

# Test a query
query {
  me {
    id
    name
    email
  }
}
```

**Expected Output:**
- Server running on port 4000 ✓
- Client running on port 5173 ✓
- Schema introspected to `schema.graphql` ✓
- GraphQL Playground works ✓

---

#### **Day 3-4: Your First Fragment (2 hours)**

**Topics:**
- Writing GraphQL fragments
- Fragment spread syntax
- useFragment hook

**Code Exercise: Create UserCard component**

**File: `apps/client/src/components/UserCard.tsx`**

```typescript
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
  const data = useFragment(UserCardFragment, user);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>{data.name}</h3>
      <p>{data.email}</p>
    </div>
  );
}
```

**Steps:**
1. Create fragment file with `graphql` tag
2. Run `pnpm relay` to generate types
3. Use `useFragment` to access typed data
4. Verify TypeScript auto-completion

**Commands:**
```bash
# From monorepo root
pnpm relay

# Should output:
# Compiled successfully
# Generated ./src/__generated__/UserCard_user.graphql.ts
```

**Expected Outcome:**
- Fragment compiles without errors ✓
- TypeScript provides type safety ✓
- Component has proper types ✓

---

#### **Day 5: Query Loading Patterns Intro (1.5 hours)**

**Topics:**
- useLazyLoadQuery (simplest pattern)
- Query vs. query documents
- Suspense with Relay

**Code Exercise: Create HomePage with query**

**File: `apps/client/src/pages/Home.tsx`**

```typescript
import { useLazyLoadQuery, graphql, Suspense } from 'react-relay';
import type { HomeQuery } from '../__generated__/Home_HomeQuery.graphql';
import { UserCard } from '../components/UserCard';

const HomePageQuery = graphql`
  query HomeQuery {
    me {
      ...UserCard_user
    }
  }
`;

export function HomePage() {
  const queryRef = useLazyLoadQuery<HomeQuery>(HomePageQuery);

  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <UserCard user={queryRef.me} />
      </Suspense>
    </div>
  );
}
```

**File: `apps/client/src/App.tsx` (Updated)**

```typescript
import { Suspense } from 'react';
import { HomePage } from './pages/Home';

export default function App() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <HomePage />
    </Suspense>
  );
}
```

**Steps:**
1. Write query with fragment spread
2. Use useLazyLoadQuery hook
3. Wrap component with Suspense
4. Test in browser

**Commands:**
```bash
# Compile query
pnpm relay

# Start dev environment (if not already running)
pnpm dev

# Visit http://localhost:5173
```

**Expected Outcome:**
- Query executes ✓
- Data loads and displays ✓
- Suspense fallback shows during load ✓
- No TypeScript errors ✓

---

### **Week 1 Checkpoint (Self-Assessment)**

- [ ] Relay environment set up in monorepo
- [ ] First fragment written and used
- [ ] First query loads and renders data
- [ ] TypeScript generation works
- [ ] useLazyLoadQuery works with Suspense
- [ ] `pnpm dev` runs both server + client

**Estimated Time: 6 hours | ~1.2 hours/day**

---

## **Week 2: Fragments Deep Dive & Composition (6 hours)**

### Learning Objectives
- Master fragment spreads and composition
- Understand fragment colocation
- Practice nested fragments
- Learn @skip/@include directives

### Daily Breakdown

#### **Day 1-2: Fragment Composition Patterns (2.5 hours)**

**Code Exercise: Build nested Post component**

**File: `apps/client/src/components/Post.tsx`**

```typescript
import { useFragment, graphql } from 'react-relay';
import type { Post_post$key } from '../__generated__/Post_post.graphql';
import { UserCard } from './UserCard';

const PostFragment = graphql`
  fragment Post_post on Post {
    id
    title
    body
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
    <article style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      marginBottom: '1rem',
      borderRadius: '8px'
    }}>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
      <small>
        {new Date(data.createdAt).toLocaleDateString()}
      </small>
      <div style={{ marginTop: '1rem' }}>
        <h4>By:</h4>
        <UserCard user={data.author} />
      </div>
    </article>
  );
}
```

**File: `apps/client/src/pages/Home.tsx` (Updated)**

```typescript
import { useLazyLoadQuery, graphql, Suspense } from 'react-relay';
import type { HomeQuery } from '../__generated__/Home_HomeQuery.graphql';
import { UserCard } from '../components/UserCard';
import { Post } from '../components/Post';

const HomePageQuery = graphql`
  query HomeQuery {
    me {
      ...UserCard_user
      posts(first: 5) {
        edges {
          node {
            id
            ...Post_post
          }
        }
      }
    }
  }
`;

export function HomePage() {
  const queryRef = useLazyLoadQuery<HomeQuery>(HomePageQuery);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Welcome, {queryRef.me.name}</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <section>
          <h2>Your Posts</h2>
          {queryRef.me.posts.edges.map(({ node }) => (
            <Post key={node.id} post={node} />
          ))}
        </section>
      </Suspense>
    </div>
  );
}
```

**Steps:**
1. Create Post fragment
2. Compose UserCard fragment inside
3. Update query to include full tree
4. Run compiler
5. Test in browser

**Commands:**
```bash
pnpm relay
# Should generate:
# - Post_post.graphql.ts
# - Home_HomeQuery.graphql.ts
# - Both should reference UserCard_user.graphql.ts
```

**Expected Outcome:**
- Multiple levels of fragments work ✓
- UserCard renders within Post ✓
- Data flows through fragment spreads ✓
- Browser displays posts with authors ✓

---

#### **Day 3-4: Fragment Directives & Aliases (2 hours)**

**Code Exercise: Add conditional rendering**

**File: `apps/client/src/components/Post.tsx` (Updated)**

```typescript
const PostFragment = graphql`
  fragment Post_post on Post {
    id
    title
    body
    createdAt
    author {
      ...UserCard_user
    }
  }
`;

// For future use - learn about conditionals:
// fragment Post_post on Post @argumentDefinitions(showDetails: {type: "Boolean!", defaultValue: true}) {
//   id
//   title @skip(if: !$showDetails)
//   body @include(if: $showDetails)
//   createdAt
//   author {
//     ...UserCard_user
//   }
// }
```

**Learning Focus:**
- Review @skip/@include in [Relay docs](https://relay.dev/docs/guided-tour/query-directives/)
- Understand when to use conditional data
- Don't implement yet (save for later weeks)

---

#### **Day 5: Composition Assessment (1.5 hours)**

**Challenge: Build UserProfile page**

**File: `apps/client/src/pages/UserProfile.tsx`**

```typescript
import { useLazyLoadQuery, graphql, Suspense } from 'react-relay';
import type { UserProfileQuery } from '../__generated__/UserProfile_UserProfileQuery.graphql';
import { UserCard } from '../components/UserCard';
import { Post } from '../components/Post';

const UserProfileQuery = graphql`
  query UserProfileQuery($userId: ID!) {
    node(id: $userId) {
      ... on User {
        ...UserCard_user
        posts(first: 10) {
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    }
  }
`;

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const queryRef = useLazyLoadQuery<UserProfileQuery>(
    UserProfileQuery,
    { userId }
  );

  if (!queryRef.node) {
    return <div>User not found</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <UserCard user={queryRef.node} />
      <section style={{ marginTop: '2rem' }}>
        <h2>Posts</h2>
        {queryRef.node.posts.edges.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          queryRef.node.posts.edges.map(({ node }) => (
            <Post key={node.id} post={node} />
          ))
        )}
      </section>
    </div>
  );
}
```

**File: `apps/client/src/App.tsx` (Updated for testing)**

```typescript
import { Suspense, useState } from 'react';
import { HomePage } from './pages/Home';
import { UserProfile } from './pages/UserProfile';

export default function App() {
  const [route, setRoute] = useState<'home' | 'profile'>('home');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('profile')}>User Profile</button>
      </nav>

      {route === 'home' && <HomePage />}
      {route === 'profile' && (
        <UserProfile userId="user:1" />
      )}
    </Suspense>
  );
}
```

**Acceptance Criteria:**
- ✓ Query with variable works
- ✓ User data and posts display
- ✓ Fragments compose correctly
- ✓ No TypeScript errors
- ✓ Can switch between routes

---

### **Week 2 Checkpoint (Rubric-Based)**

| Criterion | Excellent (3) | Good (2) | Needs Work (1) | Score |
|-----------|---------------|---------|----------------|-------|
| **Fragment Nesting** | 3+ levels compose seamlessly | 2 levels; minor issues | Fragments broken | ___ |
| **TypeScript Integration** | Zero errors; full IDE support | Minor warnings | Multiple unresolved types | ___ |
| **Code Organization** | Clear boundaries; colocation | Mostly good | Messy data flow | ___ |
| **Functionality** | All components render correctly | Most work; edge cases | Significant bugs | ___ |

**Target Score: 10–12 / 12**

**Commit & Push:**
```bash
git add .
git commit -m "Week 2: Fragment composition and nesting"
git push
```

**Estimated Time: 6 hours | ~1.2 hours/day**

---

## **Week 3: Query Loading Patterns & Preloading (6 hours)**

### Learning Objectives
- Master useQueryLoader / usePreloadedQuery
- Understand query loading lifecycle
- Learn when to use each pattern
- Practice route-level preloading

### Daily Breakdown

#### **Day 1-2: Query Loader Pattern (2.5 hours)**

**Topics:**
- useLazyLoadQuery (review) — simple, no control
- useQueryLoader + usePreloadedQuery — controlled, powerful
- Preloading for UX improvements

**Reference:**
- [Relay Docs: useQueryLoader](https://relay.dev/docs/api-reference/use-query-loader/)
- [Relay Docs: usePreloadedQuery](https://relay.dev/docs/api-reference/use-preloaded-query/)

**Code Exercise: Build PostDetail with preloading**

**File: `apps/client/src/pages/PostDetail.tsx`**

```typescript
import { usePreloadedQuery, graphql, Suspense } from 'react-relay';
import type { PostDetailQuery as PostDetailQueryType } from '../__generated__/PostDetail_PostDetailQuery.graphql';
import type { PreloadedQuery } from 'react-relay';
import { UserCard } from '../components/UserCard';

const PostDetailQuery = graphql`
  query PostDetailQuery($postId: ID!) {
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

interface PostDetailProps {
  queryRef: PreloadedQuery<PostDetailQueryType>;
}

export function PostDetail({ queryRef }: PostDetailProps) {
  const data = usePreloadedQuery(PostDetailQuery, queryRef);

  if (!data.node) {
    return <div>Post not found</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{data.node.title}</h1>
      <p style={{ color: '#666' }}>
        {new Date(data.node.createdAt).toLocaleString()}
      </p>
      <article style={{ margin: '2rem 0', lineHeight: '1.6' }}>
        {data.node.body}
      </article>
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
        <h3>Author</h3>
        <UserCard user={data.node.author} />
      </div>
    </div>
  );
}
```

**File: `apps/client/src/pages/PostDetailContainer.tsx`** (Container with preloading)

```typescript
import { useQueryLoader, Suspense, graphql } from 'react-relay';
import type { PostDetailContainerQuery as PostDetailContainerQueryType } from '../__generated__/PostDetailContainer_PostDetailContainerQuery.graphql';
import { PostDetail } from './PostDetail';
import { useEffect } from 'react';

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
  const [queryRef, loadQuery] = useQueryLoader<PostDetailContainerQueryType>(
    PostDetailContainerQuery,
  );

  useEffect(() => {
    loadQuery({ postId });
  }, [postId, loadQuery]);

  return (
    <Suspense fallback={<div>Loading post...</div>}>
      {queryRef && <PostDetail queryRef={queryRef} />}
    </Suspense>
  );
}
```

**Steps:**
1. Create PostDetail that receives preloaded query
2. Create Container with useQueryLoader
3. Container loads query on mount
4. Pass queryRef to PostDetail
5. Test navigation

**Commands:**
```bash
pnpm relay

# Should generate PostDetailContainerQuery
```

**Expected Outcome:**
- ✓ useQueryLoader loads data
- ✓ usePreloadedQuery receives it
- ✓ Suspense fallback displays during load
- ✓ Can change postId and re-load

---

#### **Day 3-4: Preloading for Performance (2 hours)**

**Topics:**
- Preload before navigation
- RequestPolicy (cache-only, store-or-network, network-only)
- Avoiding waterfalls

**Code Exercise: Preload utilities**

**File: `apps/client/src/utils/preloadQuery.ts`**

```typescript
import environment from '../relay/environment';
import { graphql } from 'react-relay';

const PostDetailQuery = graphql`
  query PreloadPostDetailQuery($postId: ID!) {
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

export function preloadPostDetail(postId: string) {
  const queryRef = environment.loadQuery(PostDetailQuery, { postId });
  return queryRef;
}
```

**File: `apps/client/src/components/PostList.tsx`** (with preload on hover)

```typescript
import { useLazyLoadQuery, graphql, Suspense } from 'react-relay';
import type { PostListQuery } from '../__generated__/PostList_PostListQuery.graphql';
import { preloadPostDetail } from '../utils/preloadQuery';

const PostListQuery = graphql`
  query PostListQuery {
    posts(first: 20) {
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
  const queryRef = useLazyLoadQuery<PostListQuery>(PostListQuery);

  const handlePostHover = (postId: string) => {
    // Preload on hover for better UX
    preloadPostDetail(postId);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>All Posts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {queryRef.posts.edges.map(({ node }) => (
          <li
            key={node.id}
            onMouseEnter={() => handlePostHover(node.id)}
            onClick={() => onSelectPost(node.id)}
            style={{
              padding: '0.75rem',
              marginBottom: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {node.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Learning Focus:**
- Preload improves perceived performance
- User doesn't wait for data load after click

---

#### **Day 5: Preloading Assessment (1.5 hours)**

**Challenge: Build simple router with preloading**

**File: `apps/client/src/App.tsx` (Updated)**

```typescript
import { Suspense, useState } from 'react';
import { HomePage } from './pages/Home';
import { PostDetailContainer } from './pages/PostDetailContainer';
import { PostList } from './components/PostList';

type Route = 
  | { type: 'home' }
  | { type: 'post-list' }
  | { type: 'post-detail'; postId: string };

export default function App() {
  const [route, setRoute] = useState<Route>({ type: 'home' });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <nav style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '1rem'
      }}>
        <button onClick={() => setRoute({ type: 'home' })}>Home</button>
        <button onClick={() => setRoute({ type: 'post-list' })}>
          All Posts
        </button>
      </nav>

      <div>
        {route.type === 'home' && <HomePage />}
        
        {route.type === 'post-list' && (
          <PostList 
            onSelectPost={(postId) => 
              setRoute({ type: 'post-detail', postId })
            }
          />
        )}
        
        {route.type === 'post-detail' && (
          <PostDetailContainer postId={route.postId} />
        )}
      </div>
    </Suspense>
  );
}
```

**Acceptance Criteria:**
- ✓ Navigate between list and detail
- ✓ useQueryLoader loads correctly
- ✓ usePreloadedQuery receives data
- ✓ Proper Suspense boundaries
- ✓ Preload on hover works
- ✓ No TypeScript errors

**Commit & Push:**
```bash
git add .
git commit -m "Week 3: Query loading patterns and preloading"
git push
```

**Estimated Time: 6 hours | ~1.2 hours/day**

---

## **Week 4: Mutations & Optimistic Updates (7 hours)**

### Learning Objectives
- Write GraphQL mutations
- Use useMutation hook
- Implement optimistic updates
- Handle connection updates
- Master the updater function

### Daily Breakdown

#### **Day 1-2: Basic Mutations (2.5 hours)**

**Topics:**
- Mutation syntax & structure
- useMutation hook
- onCompleted / onError callbacks

**Reference:**
- [Relay Docs: useMutation](https://relay.dev/docs/api-reference/use-mutation/)
- [Relay Docs: Mutations](https://relay.dev/docs/guided-tour/mutations/)

**Code Exercise: Create Post mutation**

**File: `apps/client/src/mutations/CreatePostMutation.ts`**

```typescript
import { graphql } from 'react-relay';

export const CreatePostMutation = graphql`
  mutation CreatePostMutation($title: String!, $body: String!) {
    createPost(title: $title, body: $body) {
      post {
        id
        title
        body
        createdAt
        author {
          id
          name
        }
      }
      error
    }
  }
`;
```

**File: `apps/client/src/components/CreatePostForm.tsx`**

```typescript
import { useState } from 'react';
import { useMutation } from 'react-relay';
import type { CreatePostMutation as CreatePostMutationType } from '../mutations/CreatePostMutation';
import { CreatePostMutation } from '../mutations/CreatePostMutation';

export function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [commit, isPending] = useMutation<CreatePostMutationType>(
    CreatePostMutation,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    commit({
      variables: { title, body },
      onCompleted: (response) => {
        if (response.createPost.error) {
          alert(`Error: ${response.createPost.error}`);
        } else {
          alert('Post created successfully!');
          setTitle('');
          setBody('');
        }
      },
      onError: (error) => {
        console.error('Mutation failed:', error);
        alert('Failed to create post');
      },
    });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <h3>Create New Post</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            disabled={isPending}
            style={{
              display: 'block',
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.5rem',
            }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Content:
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Post content"
            disabled={isPending}
            style={{
              display: 'block',
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.5rem',
              minHeight: '150px',
            }}
            required
          />
        </label>
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: isPending ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

**Steps:**
1. Define mutation in separate file
2. Use useMutation hook
3. Call commit with variables
4. Handle onCompleted/onError

**Commands:**
```bash
pnpm relay
# Generates CreatePostMutation artifact
```

**Expected Outcome:**
- ✓ Form submits mutation
- ✓ Loading state works
- ✓ Success/error callbacks work
- ✓ Form resets on success

---

#### **Day 3: Optimistic Updates (2 hours)**

**Topics:**
- Why optimistic updates matter
- Optimistic response configuration
- Rollback on error

**Code Exercise: Add optimistic response**

**File: `apps/client/src/components/CreatePostForm.tsx` (Updated)**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  commit({
    variables: { title, body },
    optimisticResponse: {
      createPost: {
        post: {
          id: `post:temp:${Math.random()}`, // Temporary ID
          title,
          body,
          createdAt: new Date().toISOString(),
          author: {
            id: 'user:1', // Assume current user
            name: 'You',
          },
        },
        error: null,
      },
    },
    onCompleted: (response) => {
      if (response.createPost.error) {
        alert(`Error: ${response.createPost.error}`);
      } else {
        alert('Post created successfully!');
        setTitle('');
        setBody('');
      }
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      alert('Failed to create post (rolled back)');
    },
  });
};
```

**Learning Focus:**
- optimisticResponse shape matches mutation response
- Temporary IDs are fine (Relay merges real ID after server responds)
- If mutation fails, Relay automatically rolls back

---

#### **Day 4-5: Connection Updates (2.5 hours)**

**Topics:**
- Relay connections (edge/node pattern)
- PREPEND vs APPEND
- Updater function for connection updates

**Code Exercise: Add post to connection**

**File: `apps/client/src/components/PostListWithCreate.tsx`**

```typescript
import { useFragment, graphql, Suspense } from 'react-relay';
import type { PostListWithCreate_user$key } from '../__generated__/PostListWithCreate_user.graphql';
import { Post } from './Post';
import { CreatePostForm } from './CreatePostForm';

const PostListWithCreateFragment = graphql`
  fragment PostListWithCreate_user on User {
    id
    posts(first: 10) @connection(key: "PostListWithCreate_posts") {
      edges {
        node {
          id
          ...Post_post
        }
      }
    }
  }
`;

interface PostListWithCreateProps {
  user: PostListWithCreate_user$key;
}

export function PostListWithCreate({ user }: PostListWithCreateProps) {
  const data = useFragment(PostListWithCreateFragment, user);

  return (
    <div>
      <CreatePostForm connectionKey="PostListWithCreate_posts" />
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <h2>Posts ({data.posts.edges.length})</h2>
        {data.posts.edges.length === 0 ? (
          <p>No posts yet. Create one above!</p>
        ) : (
          data.posts.edges.map(({ node }) => (
            <Post key={node.id} post={node} />
          ))
        )}
      </section>
    </div>
  );
}
```

**File: `apps/client/src/components/CreatePostForm.tsx` (with updater)**

```typescript
import { useMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import type { CreatePostMutation as CreatePostMutationType } from '../mutations/CreatePostMutation';
import { CreatePostMutation } from '../mutations/CreatePostMutation';

interface CreatePostFormProps {
  connectionKey: string; // Relay connection ID from fragment
}

export function CreatePostForm({ connectionKey }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [commit, isPending] = useMutation<CreatePostMutationType>(
    CreatePostMutation,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    commit({
      variables: { title, body },
      optimisticResponse: {
        createPost: {
          post: {
            id: `post:temp:${Math.random()}`,
            title,
            body,
            createdAt: new Date().toISOString(),
            author: {
              id: 'user:1',
              name: 'You',
            },
          },
          error: null,
        },
      },
      updater: (store, response) => {
        if (response.createPost.error) return;

        // Get the connection (marked with @connection in fragment)
        const connection = ConnectionHandler.getConnection(
          store.getRoot(),
          connectionKey,
        );

        if (connection && response.createPost.post) {
          const post = response.createPost.post;

          // Create edge from response
          const newEdge = ConnectionHandler.createEdge(
            store,
            connection,
            post,
            'PostEdge',
          );

          // Prepend new post to top of list
          ConnectionHandler.insertEdgeBefore(connection, newEdge);
        }
      },
      onCompleted: (response) => {
        if (!response.createPost.error) {
          setTitle('');
          setBody('');
          alert('Post created!');
        }
      },
    });
  };

  return (
    //