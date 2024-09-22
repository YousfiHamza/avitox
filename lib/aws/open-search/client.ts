import { Client } from '@opensearch-project/opensearch';

const host = process.env.OPENSEARCH_ENDPOINT!;
const username = process.env.OPENSEARCH_USERNAME!;
const password = process.env.OPENSEARCH_PASSWORD!;

const opensearchClient = new Client({
  node: host,
  auth: {
    username,
    password,
  },
});

export default opensearchClient;
