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
