import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

const network = Network.create(async (params, variables) => {
  const response = await fetch(GRAPHQL_URL, {
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
