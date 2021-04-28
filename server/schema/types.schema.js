const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull
} = graphql;

//Scalar Type

//Scalar Type
/*
String
int
Float
Boolean
ID
*/

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a Person type',
    fields: () => ({
        id: { type: GraphQLID },
        name: {type: new GraphQLNonNull(GraphQLString) },
        age: {type: GraphQLInt },
        isMarried: {type: GraphQLBoolean },
        gpa: { type: GraphQLFloat },
        justAType : {
            type: Person,
            resolve(parent, args){
                return parent;
            }
        }
    })
});


// Root query - path which allows us to start triversing down the siblings, etc
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
      person: {
          type: Person,
          resolve(parent, args) {
              let personObj = {
                  name: 'Antonio',
                  age: 35,
                  isMarried: true,
                  gpa: 4.0,
              }
              return personObj;
          }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})