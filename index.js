const fs = require('fs');
const axios = require ('axios');
const inquirer = require('inquirer');
const template = require('./generateHTML.js');
const pdf = require('html-pdf');
const options = { format: 'Letter' };

function getUserResponse(){
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
      githubCall(response)
    });
}

function githubCall(obj){
  return new Promise((res, rej) => {
    if (!obj.username || !obj.favColor) {
      rej("Something went wrong. Please try again");
    } else {
      const queryURL = `https://api.github.com/users/${obj.username}`;
      const chosenColor = obj.favColor;
      axios
        .get(queryURL)
        .then(function(response){
          response.color = chosenColor;
          response.starsURL = queryURL + `/starred`;
          // console.log(response);
          res(response);
        });
    }
  })
    .then(funcResponse => githubStarsCall(funcResponse))
    .then(starResponse => generateHTML(starResponse))
    .then(rawHTML => convertToPDF(rawHTML))
    .catch(err => console.log(err));
}

function githubStarsCall(obj){
  return new Promise((res,rej) => {
    if (!obj.starsURL){
      rej("Invalid github stars API URL");
    } else {
      // console.log(obj);
      axios
      .get(obj.starsURL)
      .then(function(starResponse){
        obj.starredLength = starResponse.data.length;
        res(obj);
      })
    }
  });
}

function generateHTML(obj){
  return new Promise((res,rej) => {
    if (!obj){
      rej("Where'd your object go?")
    } else {
      const data = template.generateHTML(obj);
      fs.writeFile('resume.html', data, (err) => {
        if (err) throw err;
        else console.log('success');
      });
      res(data);
      // const html = fs.readFileSync('./resume.html', 'utf8');
      // res(html);
    }
  });
}

function convertToPDF(str){
  return new Promise((res,rej) => {
    if (!str) {
      rej('so close...');
    } else {
      pdf.create(str, options).toFile('./resume.pdf', function(error, resolve){
        if (error) {
          return console.log(error);
        } else {
          console.log(resolve);
        }
        res('success');
      });
    }
  });
}

getUserResponse();