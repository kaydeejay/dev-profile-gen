const fs = require('fs');
const axios = require ('axios');
const inquirer = require('inquirer');
const generateHTML = require('./generateHTML.js');

console.log(generateHTML.generateHTML);
// console.log(generateHTML);

inquirer
  .prompt([
    {
      type: 'input',  
      message: 'Enter Your Github Username',
      name: 'username'
    },
    {
      type: 'list',  
      message: 'What is your Favorite Color?',
      choices: ['red','pink','green','blue'],
      name: 'favColor'
    }
  ])
  .then(function(response){
    // console.log(response);
    const queryURL = `https://api.github.com/users/${response.username}`;
    axios
      .get(queryURL)
      .then(function(response){
          // do whatever, got the data
          console.log(queryURL);
          console.log(response);
      });
  }); 