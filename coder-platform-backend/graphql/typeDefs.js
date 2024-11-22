const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		email: String!
		profilePicture: String
	}

	type Query {
		getUser(id: ID!): User
		getUsers: [User]
	}

	type Mutation {
		register(username: String!, email: String!, password: String!): User
		login(email: String!, password: String!): String
	}

	type Subscription {
		userAdded: User
	}
`;

module.exports = typeDefs;
