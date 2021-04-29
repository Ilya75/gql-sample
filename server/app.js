const express = require('express');
const mongoose = require('mongoose')
// const { graphqlHTTP } = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;

mongoose.connect('<mongodburl>',
{                     
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('Mongo Db connected !!!')
});

const schema = require('./schema/schema');
const testSchema = require('./schema/types.schema')
const cors = require('cors');
const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql:true,
    //schema:testSchema
    schema: schema
})) 

app.listen(port, () => {
    console.log("Listening for requests");
})