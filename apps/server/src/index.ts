import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { schema } from './schema';

const PORT = process.env.PORT || 4000;

const yoga = createYoga({ schema });
const server = createServer(yoga);

server.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
