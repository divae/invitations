const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/api/invitation/new' , async (req,res) =>{
    const {title, description, image  } = req.body;

    res.redirect(`/api/invitation?title=${title}&description=${description}&image=${image}`);
});

app.get('/api/invitation',async (req,res) => {

    const { title,description,image } = req.query;

    console.log(JSON.stringify(req.query,undefined,2));

    res.send({
        title,
        description,
        image
    });
});

app.get('/', (req,res) => {
    //res.send({hi: 'there'});
    res.send('hello world');
});

app.listen(5000);