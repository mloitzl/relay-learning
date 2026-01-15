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
