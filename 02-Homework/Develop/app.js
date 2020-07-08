const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { inherits } = require("util");

employees= [];

function writeToFile(fileName, data){
    fs.writeFile(fileName, data, function(error){
        if (error) throw error;
        console.log("success");
    })
}

function init() {
    inquirer.prompt(
    {
        type:"confirm",
        message:"Would you like to add a new employee?",
        name:"addEmployee"    
    }
    )
    .then(function(response){
        console.log(response);
        
        if (response.addEmployee === true) {
            inquirer.prompt(
             [   {
                    type:"input",
                    message:"What is your name?",
                    name:"name"
                }
                ,
                {
                    type:"input",
                    message:"What is your employee ID?",
                    name:"id"
                }
                ,
                {
                    type:"input",
                    message:"What is your email address?",
                    name:"email"
                }
                ,
                {
                    type:"list",
                    message:"What is your role within the company?",
                    name:"role",
                    choices:["Manager", "Engineer", "Intern"]
                }]
            )
            .then(function(answer){
                console.log(answer);
                
                if (answer.role === "Engineer"){
                    inquirer.prompt(
                        {
                            type:"input",
                            message:"What is your GitHub username?",
                            name: "github"
                        }
                    )
                    .then(function(githubResponse){
                        const engineer = new Engineer(answer.name, answer.id, answer.email, githubResponse.github)
                        console.log(engineer);
                        employees.push(engineer);
                        console.log(employees);
                        init();
                    })
                }
                else if (answer.role === "Manager") {
                    inquirer.prompt(
                        {
                            type:"input",
                            message: "What is your office number?",
                            name: "officeNumber"
                        }
                    )
                    .then(function(officeNumberResponse){
                        const manager = new Manager(answer.name, answer.id, answer.email, officeNumberResponse.officeNumber)
                        console.log(manager);
                        employees.push(manager);
                        init();
                    })
                }
                else if (answer.role === "Intern") {
                    inquirer.prompt(
                        {
                            type:"input",
                            message:"What school do you attend?",
                            name: "school"
                        }
                    )
                    .then(function(schoolResponse){
                        const intern = new Intern(answer.name, answer.id, answer.email, schoolResponse.school)
                        console.log(intern);
                        employees.push(intern);
                        init();
                    })
                }
            })
        } else {
            const output = render(employees);
            console.log(render(employees))
            writeToFile(outputPath, output)
        }
    }).catch(function(err){
        if (err) throw err
    })
}
console.log(employees);
init();
