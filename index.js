const fs = require('fs');
const axios = require ('axios');
const inquirer = require('inquirer');

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
      choices: ['red','orange','yellow','green','blue','purple'],
      name: 'favColor'
    }
  ])
  .then(function(response){
    // console.log(response);
    const queryURL = `https://api.github.com/users/${response.username}/repos?per_page=100`;
    axios
      .get(queryURL)
      .then(function(response){
          // do whatever, got the data
          console.log(response[0]);
      });
  }); 