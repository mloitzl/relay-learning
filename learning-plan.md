# GitHub Codespaces Setup for Monorepo (pnpm)

**Current Date:** 2026-01-13  
**Your GitHub:** mloitzl  
**Setup Time:** ~10 minutes

---

## Quick Start: Create Codespaces for Monorepo

### **Step 1: Create the Monorepo Repository**

Go to **github.com/mloitzl** and create a new repository:

```
Name: relay-learning
Description: Monorepo for learning React Relay (server + client)
Visibility: Public
Don't initialize with README or .gitignore (we'll add them)
```

---

### **Step 2: Create Codespace from Empty Repository**

```
1. Go to github.com/mloitzl/relay-learning
2. Click "Code" button (green)
3. Click "Codespaces" tab
4. Click "Create codespace on main"
5. Wait 30-60 seconds for VS Code to load in browser
```

**You now have:** VS Code running in browser with full terminal access

---

### **Step 3: Initialize Monorepo Structure in Codespace**

**In the Codespace terminal, run:**

```bash
# Initialize monorepo root
pnpm init -y

# Create monorepo configuration
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create apps directory structure
mkdir -p apps/server/src apps/client/src packages/{testing-utils,graphql-types}
```

---

### **Step 4: Create Root package.json**

**Replace the auto-generated `package.json` with:**

```bash
cat > package.json << 'EOF'
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
    "relay": "pnpm --filter @relay-learning/client relay",
    "relay:watch": "pnpm --filter @relay-learning/client relay:watch",
    "test": "pnpm -r --parallel test",
    "test:ui": "pnpm --filter @relay-learning/client test:ui",
    "type-check": "pnpm -r --parallel type-check",
    "clean": "pnpm -r --parallel clean && pnpm -r exec rm -rf node_modules .turbo",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  },
  "devDependencies": {
    "prettier": "^3.1.0",
    "turbo": "^1.10.0"
  }
}
EOF
```

---

### **Step 5: Set Up GraphQL Server Package**

```bash
# Navigate to server directory
cd apps/server

# Initialize server package
pnpm init -y

# Create server package.json
cat > package.json << 'EOF'
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
EOF
```

**Create TypeScript config for server:**

```bash
cat > tsconfig.json << 'EOF'
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
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
EOF
```

**Create GraphQL schema:**

```bash
cat > src/schema.ts << 'EOF'
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
        const startIdx = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
        const edges = mockPosts.slice(startIdx, startIdx + first).map((post, idx) => ({
          cursor: Buffer.from((startIdx + idx).toString()).toString('base64'),
          node: post,
        }));
        return {
          edges,
          pageInfo: {
            hasNextPage: startIdx + first < mockPosts.length,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          },
        };
      },
    },
    User: {
      posts: (user, { first = 10, after }) => {
        const userPosts = mockPosts.filter(p => p.author.id === user.id);
        const startIdx = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
        const edges = userPosts.slice(startIdx, startIdx + first).map((post, idx) => ({
          cursor: Buffer.from((startIdx + idx).toString()).toString('base64'),
          node: post,
        }));
        return {
          edges,
          pageInfo: {
            hasNextPage: startIdx + first < userPosts.length,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
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

const mockUsers = [
  { id: 'user:1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user:2', name: 'Bob', email: 'bob@example.com' },
];

const mockPosts = [
  {
    id: 'post:1',
    title: 'Getting Started with Relay',
    body: 'Relay is a JavaScript framework for building data-driven React applications.',
    author: mockUsers[0],
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'post:2',
    title: 'GraphQL Fundamentals',
    body: 'GraphQL is a query language for APIs.',
    author: mockUsers[1],
    createdAt: '2026-01-05T14:30:00Z',
  },
  {
    id: 'post:3',
    title: 'Advanced Relay Patterns',
    body: 'Learn advanced patterns for managing complex data flows.',
    author: mockUsers[0],
    createdAt: '2026-01-10T09:15:00Z',
  },
];
EOF
```

**Create server entry point:**

```bash
cat > src/index.ts << 'EOF'
import { createServer } from 'http';
import { schema } from './schema';

const PORT = process.env.PORT || 4000;

const server = createServer(schema);

server.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
EOF
```

---

### **Step 6: Set Up Vite + React Client Package**

```bash
# Navigate back to monorepo root
cd ../..

# Create Vite client app
pnpm create vite apps/client -- --template react-ts

# Navigate to client
cd apps/client
```

**Update client `package.json`:**

```bash
cat > package.json << 'EOF'
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
    "type-check": "tsc --noEmit"
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
EOF
```

**Create Relay config:**

```bash
cat > relay.config.js << 'EOF'
module.exports = {
  src: './src',
  schema: './schema.graphql',
  language: 'typescript',
  eagerEsModules: true,
  artifactDirectory: './src/__generated__',
};
EOF
```

**Create Vite config:**

```bash
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
EOF
```

**Create Vitest config:**

```bash
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
EOF
```

**Create Relay environment:**

```bash
mkdir -p src/relay

cat > src/relay/environment.ts << 'EOF'
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const SERVER_URL = process.env.VITE_GRAPHQL_URL || 'http://localhost:4000';

const network = Network.create(async (params, variables) => {
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

  return response.json();
});

const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default environment;
EOF
```

**Update `src/main.tsx`:**

```bash
cat > src/main.tsx << 'EOF'
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
EOF
```

**Update `src/App.tsx`:**

```bash
cat > src/App.tsx << 'EOF'
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
EOF
```

---

### **Step 7: Install All Dependencies**

```bash
# Go back to monorepo root
cd ../..

# Install all packages at once
pnpm install
```

**Expected output:**
```
 WARN  deprecated axios@0.21.1: ...
...
packages in 45s

dependencies:
  +graphql 16.8.0
  +graphql-yoga 5.0.0
  +react 18.2.0
  +react-dom 18.2.0
  +react-relay 16.0.0
  +relay-runtime 16.0.0
```

---

### **Step 8: Introspect GraphQL Schema**

**Terminal 1: Start the server**

```bash
pnpm --filter @relay-learning/server dev
```

**Terminal 2: Introspect schema**

```bash
# Install introspection tool
cd apps/client
pnpm add -D get-graphql-schema

# Introspect running server
pnpm exec get-graphql-schema http://localhost:4000/graphql > schema.graphql

# Verify schema created
ls -lh schema.graphql
```

---

### **Step 9: Start Full Development Environment**

```bash
# From monorepo root
pnpm dev
```

**Expected output in Codespaces terminal:**

```
> pnpm -r --parallel dev

@relay-learning/server: 🚀 GraphQL server running at http://localhost:4000/graphql
@relay-learning/client: ➜  Local:   http://localhost:5173/
```

---

## Accessing from iPad Pro (In Codespaces)

### **Step 1: Make Ports Public**

In VS Code, find the **PORTS** panel (bottom of screen):

1. **Port 4000** (server)
   - Right-click → "Make Public"
   - Copy forwarded URL (e.g., `https://mloitzl-abc.github.dev`)

2. **Port 5173** (client)
   - Right-click → "Make Public"
   - Copy forwarded URL

### **Step 2: Open on iPad Safari**

Create 3 tabs:

| Tab | URL | Purpose |
|-----|-----|---------|
| **1** | `https://mloitzl-abc.github.dev` | React client app |
| **2** | `https://mloitzl-xyz.github.dev/graphql` | GraphQL Playground (test queries) |
| **3** | Codespaces editor | Edit code |

### **Step 3: Optimal iPad Layout**

```
Landscape Mode:
┌──────────────────────────────────┐
│ VS Code (left 60%)               │
├──────────────────────────────────┤
│ Safari Preview (right 40%)       │
│ (client app or GraphQL Playground)
└──────────────────────────────────┘
```

---

## Monorepo Commands in Codespaces

### **Start Development**

```bash
# Start both server & client
pnpm dev

# Or individually:
pnpm --filter @relay-learning/server dev
pnpm --filter @relay-learning/client dev
```

### **Relay Compiler**

```bash
# Run once
pnpm relay

# Watch for changes
pnpm relay:watch
```

### **Testing**

```bash
# Run tests
pnpm test

# Watch mode
pnpm test -- --watch

# UI mode (great on iPad)
pnpm test:ui
```

### **Type Checking**

```bash
# Check all packages
pnpm type-check

# Build client
pnpm build
```

### **Git Operations**

```bash
# Commit all changes
git add .
git commit -m "Week 1: Fragment fundamentals"
git push

# Check status
git status

# View logs
git log --oneline
```

---

## File Structure After Complete Setup

```
relay-learning/ (in Codespaces)
├── pnpm-workspace.yaml ✅
├── package.json ✅
├── .gitignore
├── turbo.json (optional)
│
├── apps/
│   ├── server/ ✅
│   │   ├── src/
│   │   │   ├── schema.ts ✅
│   │   │   └── index.ts ✅
│   │   ├── package.json ✅
│   │   └── tsconfig.json ✅
│   │
│   └── client/ ✅
│       ├── src/
│       │   ├── relay/
│       │   │   └── environment.ts ✅
│       │   ├── App.tsx ✅
│       │   └── main.tsx ✅
│       ├── schema.graphql ✅ (after introspection)
│       ├── relay.config.js ✅
│       ├── vite.config.ts ✅
│       ├── vitest.config.ts ✅
│       ├── tsconfig.json ✅
│       └── package.json ✅
│
├── packages/ (optional, for later)
│   ├── testing-utils/
│   └── graphql-types/
│
└── node_modules/ (all deps, deduplicated by pnpm)
```

---

## Verification Checklist

Before starting Week 1:

- [ ] Codespace created and VS Code loads
- [ ] `pnpm --version` shows v8+
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts both apps (4000 & 5173)
- [ ] Server GraphQL playground loads at :4000/graphql
- [ ] Client loads at :5173
- [ ] `schema.graphql` exists in client directory
- [ ] `pnpm relay` generates artifacts without errors
- [ ] Both ports are Public (for iPad access)
- [ ] Can navigate between Safari tabs smoothly
- [ ] Initial commit pushed to GitHub

**Once all ✓ checkboxes complete, you're ready to start the 12-week plan!**

---

## Troubleshooting Codespaces + Monorepo

| Issue | Solution |
|-------|----------|
| **pnpm not found** | Run `corepack enable` then retry |
| **Ports not showing** | Click Terminal tab area, look for "PORTS" label |
| **Can't access from iPad** | Ensure ports are "Public" (not "Private") |
| **Codespace goes to sleep** | Click anywhere in editor; auto-resumes |
| **Changes not hot-reloading** | Vite HMR should auto-refresh; if not, manual refresh works |
| **Server won't start** | Kill old process: `pkill -f "node.*schema"` |
| **schema.graphql errors** | Server must be running when you run introspection command |
| **TypeScript errors** | Run `pnpm type-check` and fix issues |
| **node_modules is huge** | Normal for monorepo; pnpm deduplicates automatically |

---

## Pro Tips for iPad Development

1. **Use Safari reading mode OFF** — You need full terminal
2. **Keyboard shortcuts:**
   - `Cmd + P` = Find files
   - `Cmd + Shift + D` = Debug panel
   - `Cmd + /` = Toggle comment
3. **Split View:** Drag VS Code to 60%, Safari to 40%
4. **Terminal:** Always visible at bottom; scroll with two fingers
5. **Git workflow:** Commit often (`git commit -m "Quick save"`)
6. **Backup:** Work is auto-saved to GitHub via Codespaces

---

## Next Steps

Once setup is complete:

1. **Commit initial setup**
   ```bash
   git add .
   git commit -m "Initial monorepo setup with server + client"
   git push
   ```

2. **Start Week 1 of the learning plan**
   - Begin with `apps/client/src/components/UserCard.tsx`
   - Follow the week-by-week guide provided earlier

3. **Daily workflow:**
   - `pnpm dev` to start
   - Edit code in VS Code
   - Relay compiler auto-runs (if watching)
   - Refresh Safari to see changes
   - Commit when checkpoint complete

**You're now ready to learn Relay in a cloud-native monorepo! 🚀**