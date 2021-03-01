const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const faunadb = require('faunadb'), q = faunadb.query;
require('dotenv').config();

const client = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });

let locations = [{
  position: { lat: -34.397, lng: 150.644 },
  id:  1,
  name: 'CVS Pharmacy',
}];

let reports = [
  {
    id: 1,
    success: true,
    locationId: 1,
    timestamp: Date.now()
  }
];

const typeDefs = gql`
type Location {
  id: String
  position: LatLng
  name: String
}

type LatLng {
  lat: Float,
  lng: Float
}

input LatLngInput {
  lat: Float,
  lng: Float
}

type Report {
  id: String
  success: Boolean
  timestamp: Int
  locationId: String
}

type Query {
  locations: [Location]!
  reports: [Report]!
  reportsByLocation: [Report]!
}

type Mutation {
  createLocation(name: String!, id: String!, position: LatLngInput!): String
  removeLocation(id: String!): String
  createReport(success: Boolean!, locationId: String!): String
}
`;

const resolvers = {
  Query: {
    locations: async () => {
      return await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("Location"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      ).then((ret) => {
        return ret.data.map((item) => {
          return item.data;
        })
      })
      .catch((err) => []);
    },
    reports: async () => {
      return await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("Report"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      ).then((ret) => {
        return ret.data.map((item) => {
          return item.data;
        })
      })
      .catch((err) => []);
    },
    reportsByLocation: (obj, args, context, info) =>  reports.filter((report) => report.locationId === args.locationId)
  },
  Mutation: {
    createLocation: async (parent, args, context, info) => {
      let locations = await client.query(
        q.Create(
          q.Collection('Location'),
          {
            data: {
              id: args.id,
              position: args.position,
              name: args.name,
            }
          }
        )
      ).then((response) => {
        resolvers.Query.locations();
        resolvers.Query.reports();
      });

      return locations;
    },
    removeLocation: (parents, args, context, info) => {
      for (let i in locations) {
        if (locations[i].id === args.id) {
          locations.splice(i, 1);
        }
      }
      return args.id;
    },
    createReport: async (parents, args, context, info) => {
      let reports = await client.query(
        q.Create(
          q.Collection('Report'),
          {
            data: {
              id: Date.now().toString(),
              success: args.success,
              timestamp: Date.now(),
              locationId: args.locationId
            }
          }
        )
      ).then((response) => {
        resolvers.Query.locations();
        resolvers.Query.reports();
      });

      return reports;
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 4000 }, () => console.log('Now browse to http://localhost:4000' + server.graphqlPath)); 