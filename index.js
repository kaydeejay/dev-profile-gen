const fs = require('fs');
const axios = require ('axios');
const inquirer = require('inquirer');
const template = require('./generateHTML.js');

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
    const queryURL = `https://api.github.com/users/${response.username}`;
    const chosenColor = response.favColor;
    axios
      .get(queryURL)
      .then(function(response){
        response.color = chosenColor;
        const starsURL = queryURL + `/starred`;
        axios
        .get(starsURL)
        .then(function(starResponse){
          response.starredLength = starResponse.data.length;
          const data = template.generateHTML(response);
          fs.writeFile('tester.html', data, (err) => {
            if (err) throw err;
            else console.log('success');
          });         
        });
      });
  }); 