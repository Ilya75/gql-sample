const graphql = require('graphql');
var _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

// var usersData = [
//     {id: '1', name: 'Bond', age:36, profession: 'agent' },
//     {id: '13', name: 'Anna', age:26, profession: 'stewardess' },   
//     {id: '211', name: 'Bella', age:16, profession: 'doctor' },     
//     {id: '19', name: 'Gina', age:26, profession: 'manager' },  
//     {id: '250', name: 'Georgina', age:36, profession: 'QA' },      
// ];

// var hobbiesData = [
//     {id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '1'},
//     {id: '2', title: 'Rowing', description: 'Sweat and feel better before donuts', userId: '13'},
//     {id: '3', title: 'Swimming', description: 'Get in the water and learn to become the water', userId: '19'},
//     {id: '4', title: 'Fencing', description: 'A hibby for fency people', userId: '250'},
//     {id: '5', title: 'Swimming', description: 'Get in the water and learn to become the water', userId: '1'},
// ];

// var postsData = [
//     {id: '1', comment: 'Just some test', userId: '1'},
//     {id: '2', comment: 'Nice post!', userId: '1'},
//     {id: '3', comment: 'Hello there!', userId: '19'}
// ];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId: parent.id});
                //return _.filter(postsData, {userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id});
                //return _.filter(hobbiesData, {userId: parent.id})
            }
        },

    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for hobby...',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
                //return _.find(usersData, {id:parent.userId});
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for posts...',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
                //return _.find(usersData, {id:parent.userId})
            }
        }
    })
});

// Root query - path which allows us to start triversing down the siblings, etc
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
              //return _.find(usersData, {id: args.id})
              return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
               return User.find({});
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
                // return data for hobby
               // return _.find(hobbiesData, {id: args.id})
               return Hobby.findById(args.id);
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
               // return hobbiesData;
            }
        },
        post: {
            type: PostType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id);s
               // return _.find(postsData, {id: args.id})
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({});
             //   return postsData;
            }
        }
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                //id: {type: GraphQLInt}
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                user.save();
                return user;
            }
        },
        updateUser: {
            type: UserType,
            args: {
                     id:   { type: new GraphQLNonNull(GraphQLID)},
                     name: { type: new GraphQLNonNull(GraphQLString)},
                     age: {type: GraphQLInt},
                     profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let updateUser =  User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    { new: true } // send back the updated object
                );
                return updateUser;
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                     id:   { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let deletedUser =  User.findByIdAndRemove(
                    args.id
                ).exec();

                if (!deletedUser){
                    throw new ("Error");
                }

                return deletedUser;
            }
        },     
        createPost: {
            type: PostType,
            args: {
                // id: {type:GraphQLID}
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                });
                post.save();
                return post;
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type:GraphQLID},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let post = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    { new: true } // send back the updated object
                );
                return post;
            }
        },
        deletePost: {
            type: PostType,
            args: {
                id: {type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                let deletedPost =  Post.findByIdAndRemove(
                    args.id
                ).exec();

                if (!deletedPost){
                    throw new ("Error");
                }

                return deletedPost;
             }
        },
        createHobby: {
            type: HobbyType,
            args: {
                // id: {type:GraphQLID}
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });
                hobby.save();
                return hobby;
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type:GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString}
            },
            resolve(parent, args) {
                let updatedHobby =  Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    { new: true } // send back the updated object
                );
                return updatedHobby;
            }
        },
        deleteHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let deletedHobby =  Hobby.findByIdAndRemove(
                    args.id
                ).exec();

                if (!deletedHobby){
                    throw new ("Error");
                }

                return deletedHobby;
             }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})