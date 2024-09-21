import { NextResponse } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/server/type-defs';
import { resolvers } from '@/graphql/server/resolvers';

const isDev = process.env.NODE_ENV === 'development';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

let getHandler: any = () => {
  return NextResponse.json({ message: 'Hello MDFKH' });
};
export const POST = handler;

// Only enable GET handler in development for the playground
if (isDev) {
  getHandler = handler;
}

export const GET = getHandler;
