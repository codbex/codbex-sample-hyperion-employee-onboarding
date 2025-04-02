import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const subject = "New Onboarding Task";
const processInstanceId = execution.getProcessInstanceId();

// Sending Task Mail to HR

const hr = process.getVariable(executionId, "HR");
let hrLink = process.getVariable(executionId, "HRLink");

hrLink = `${hrLink}&processId=${processInstanceId}`;

const hrContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">New Onboarding Task</h2>
    <p>Dear ${hr},</p>
    <p>You have a new onboarding task.</p>
    <p>Please click the button below to access your inbox to complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${hrLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Fullfill Task</a>
    </div>
    <p>If you have any questions, please reach out to the HR team.</p>
    <p>Best regards,</p>
  </div>
`;

sendMail(hr, subject, hrContent);

// Sending Task Mail to IT

const it = process.getVariable(executionId, "IT");
let itLink = process.getVariable(executionId, "ITLink");

itLink = `${itLink}&processId=${processInstanceId}`;

const itContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">New Onboarding Task</h2>
    <p>Dear ${it},</p>
    <p>You have a new onboarding task.</p>
    <p>Please click the button below to access your inbox to complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${itLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Fullfill Task</a>
    </div>
    <p>If you have any questions, please reach out to the HR team.</p>
    <p>Best regards,</p>
  </div>
`;

sendMail(it, subject, itContent);

// Sending Task Mail to Manager

const trainingManager = process.getVariable(executionId, "TrainingManager");
let trainingManagerLink = process.getVariable(executionId, "TrainingManagerLink");

trainingManagerLink = `${trainingManagerLink}&processId=${processInstanceId}`;

const trainingManagerContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">New Onboarding Task</h2>
    <p>Dear ${trainingManager},</p>
    <p>You have a new onboarding task.</p>
    <p>Please click the button below to access your inbox to complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${trainingManagerLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Fullfill Task</a>
    </div>
    <p>If you have any questions, please reach out to the HR team.</p>
    <p>Best regards,</p>
  </div>
`;

sendMail(trainingManager, subject, trainingManagerContent);