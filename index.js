import express from 'express';
const app = express();
import morgan from 'morgan';
import fs from 'fs';
import fetch from 'node-fetch';

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));

let UsersData
async function createUserData() {
    const result = await fetch('https://randomuser.me/api/');
    const finaldata = await result.text();
    fs.writeFileSync(new URL('./UsersData.txt', import.meta.url), finaldata);
    UsersData = JSON.parse(finaldata);
}


if (!UsersData) {
    createUserData();
}

let textUserData = fs.readFileSync('./UsersData.txt',
    { encoding: 'utf8', flag: 'r' });


UsersData = JSON.parse(textUserData);

app.get("/api/:name", (req, res) => {
    let fullName = `full name is ${UsersData.results[0]['name']['title']} ${UsersData.results[0]['name']['first']} ${UsersData.results[0]['name']['last']}`
    res.status(200).send(fullName);
})



app.post("/api/adddata", (req, res) => {
    let key = req.body.key;
    let value = req.body.value;
    UsersData[key] = value;
    res.status(200).send(UsersData);
});


app.put("/api/updateData", (req, res) => {

    let key = req.body.key;
    let value = req.body.value;
    UsersData[key] = value;
    res.status(200).send(UsersData);

})

app.delete("/api/deletedata", (req, res) => {
    let key = req.body.key;
    delete UsersData[key];
    res.status(200).send(UsersData);
})

app.listen(3000, () => {
    console.debug('App listening on :3000');
});