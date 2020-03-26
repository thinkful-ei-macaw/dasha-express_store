require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();
const uuid = require('uuid/v4')
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json())
app.use(cors());

const users=[{
  "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
  "username": "sallyStudent",
  "password": "c00d1ng1sc00l",
  "favoriteClub": "Cache Valley Stone Society",
  "newsLetter": "true"
},
{
  "id": "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
  "username": "johnBlocton",
  "password": "veryg00dpassw0rd",
  "favoriteClub": "Salt City Curling Club",
  "newsLetter": "false"
}]

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("A POST Request");
});

app.use(function errorHandler(error, req, res, next) {
  let reponse;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

//validation 
app.post('/user', (req, res) =>{
  const {username, password, favoriteClub, newsLetter=false} =req.body;

  if(!username) {
    return res.status(400).send('username required')
  }

  if(!password){
    return res.status(400).send('password required')
  }

  if(!favoriteClub){
    return res.status(400).send('favourite club required')
  }

  if(username.length  < 6 || username.length >20){
    return res.status(400).send('username must be bewtween 6 and 20 characters')
  }
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
    return res.status(400).send('Password must be contain at least one digit')
  }
  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'  ]

    if(!clubs.includes(favoriteClub)){
      return res.status(400).send('not a valid club')
    }

    const id= uuid();//new user id;
const newUser ={
  id,
  username,
  favoriteClub,
  newsLetter
}

users.push(newUser);

    res.send('all validation passed')
})

app.delete('/user/:userID', (req, res)=>{
  const {userId}=req.params;
  console.log(userId);
  res.send('got it!')
  const index=users.findIndex(u => u.id===userId)
  if (index === -1){
    return res.status(400).send('user not found')
  }
  users.splice(index, 1)
  res.status(204).end();
})
app.get ('/user', (req, res) =>{
  res.json(users)
})

module.exports = app;
