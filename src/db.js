
const comments = [
    {
        id: '5555',
        body: 'first',
        author: '1',
        post: '2341',
    },
    {
        id: '5552',
        body: 'snd',
        author: '2',
        post: '2341',
    },
    {
        id: '5553',
        body: 'not first',
        author: '2',
        post: '2341',
    },
    {
        id: '554',
        body: 'third',
        author: '3',
        post: '32324',
    },
]

const posts = [{
    id: '2341',
    title: 'title 1s',
    body: 'this is the bodyu',
    published: true,
    author: '1',
},
{
    id: '122342342',
    title: '2222',
    body: 'this is  bodyu',
    published: false,
    author: '2',
},
{
    id: '32324',
    title: 'Rich3',
    body: ' is the bodyu',
    published: true,
    author: '3',
},
]

const users = [{
    id: '1',
    name: 'Rich',
    age: 25,
    email: 'rich@gordonholdingsco.com',
},
{
    id: '2',
    name: 'Joe',
    age: 22,
    email: 'joe@gordonholdingsco.com',
},
{
    id: '3',
    name: 'Spencer',
    email: 'spencer@gordonholdingsco.com',
},
]

const db = {
    users,
    posts, 
    comments
}

export { db as default }