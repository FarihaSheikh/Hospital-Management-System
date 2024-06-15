#! /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

interface Staff {
    role: string;
    name: string;
    specialty?: string; // Adding specialty for doctors and nurses
}

interface Patient {
    name: string;
    age: number;
    gender: string;
    condition: string;
    medications: string[]; // Adding medications field
}

class Hospital {
    patients: Patient[];
    staff: Staff[];

    constructor() {
        this.patients = [];
        this.staff = [];
    }

    admitPatient(patient: Patient) {
        this.patients.push(patient);
        console.log(chalk.green(`Patient ${patient.name} admitted successfully.`));
    }

    dischargePatient(patientName: string) {
        const index = this.patients.findIndex(patient => patient.name === patientName);
        if (index !== -1) {
            const dischargedPatient = this.patients.splice(index, 1)[0];
            console.log(chalk.yellow(`Patient ${dischargedPatient.name} discharged successfully.`));
        } else {
            console.log(chalk.red(`Patient ${patientName} not found.`));
        }
    }

    listPatients() {
        console.log(chalk.blue("List of Patients:"));
        this.patients.forEach(patient => {
            console.log(`Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}, Condition: ${patient.condition}, Medications: ${patient.medications.join(', ')}`);
        });
    }

    displayStaffBySpecialty() {
        const specialties = new Set(this.staff.map(staff => staff.specialty).filter(specialty => specialty));
        specialties.forEach(specialty => {
            console.log(chalk.blue(`\n${specialty}:`));
            this.staff.filter(staff => staff.specialty === specialty).forEach(person => console.log(person.name));
        });
    }
}

const hospital = new Hospital();
const username = "admin";
const password = "password";

async function authenticate() {
    const credentials = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Enter username:'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter password:'
        }
    ]);

    // Simple authentication logic
    if (credentials.username === username && credentials.password === password) {
        console.log(chalk.green('Authentication successful!'));
        console.log(chalk.blue("Welcome to Hospital Management System!"));
        promptUser();
    } else {
        console.log(chalk.red('Authentication failed! Please try again.'));
        authenticate();
    }
}

async function promptUser() {
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'Admit a patient', 
            'Discharge a patient', 
            'List all patients', 
            'About Us', 
            'Add doctor', 
            'Add nurse', 
            'Perform medical procedure',
            'Exit'
        ]
    });
    switch (answer.action) {
        case 'Admit a patient':
            await admitPatient();
            break;
        case 'Discharge a patient':
            await dischargePatient();
            break;
        case 'List all patients':
            listPatients();
            break;
        case 'About Us':
            hospital.displayStaffBySpecialty();
            promptUser();
            break;
        case 'Add doctor':
            await addDoctor();
            break;
        case 'Add nurse':
            await addNurse();
            break;
        case 'Perform medical procedure':
            performProcedure();
            break;
        case 'Exit':
            console.log(chalk.cyan('Thank you for using Hospital Management System. Goodbye!'));
            process.exit();
    }
}

async function addDoctor() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter doctor name:'
        },
        {
            type: 'input',
            name: 'specialty',
            message: 'Enter doctor specialty:'
        }
    ]);
    hospital.staff.push({ role: 'doctor', name: answers.name, specialty: answers.specialty });
    console.log(chalk.green(`Doctor ${answers.name} added successfully.`));
    promptUser();
}

async function addNurse() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter nurse name:'
        },
        {
            type: 'input',
            name: 'specialty',
            message: 'Enter nurse specialty:'
        }
    ]);
    hospital.staff.push({ role: 'nurse', name: answers.name, specialty: answers.specialty });
    console.log(chalk.green(`Nurse ${answers.name} added successfully.`));
    promptUser();
}

async function performProcedure() {
    console.log(chalk.blue("Performing medical procedure..."));
    // Logic for performing a medical procedure goes here
    console.log(chalk.green("Medical procedure completed successfully."));
    promptUser();
}

async function admitPatient() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter patient name:'
        },
        {
            type: 'number',
            name: 'age',
            message: 'Enter patient age:'
        },
        {
            type: 'input',
            name: 'gender',
            message: 'Enter patient gender:'
        },
        {
            type: 'input',
            name: 'condition',
            message: 'Enter patient condition:'
        },
        {
            type: 'input',
            name: 'medications',
            message: 'Enter patient medications (separate by commas if multiple):',
            filter: (input: string) => input.split(',').map(item => item.trim()) // Convert comma-separated string to array
        }
    ]);
    hospital.admitPatient(answers as Patient);
    promptUser();
}

async function dischargePatient() {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter patient name to discharge:'
    });
    hospital.dischargePatient(answer.name);
    promptUser();
}

function listPatients() {
    hospital.listPatients();
    promptUser();
}

authenticate();
