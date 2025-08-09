import mongoose from "mongoose";

// 1- create schema
// 2- create a model based off of that schema

const entrySchema = new mongoose.Schema(
  {
    "date": {
      "type": Date, // Corrected: Use Date (capital D) for Mongoose Date type
      "required": true
    },
    "time": {
      "type": String,
      "required": true
    },
    "severity": {
      "type": Number,
      "required": true,
      "min": 1,
      "max": 10
    },
    "duration": {
      "type": Number,
      "required": true
    },
    "durationUnit": {
      "type": String,
      "required": true,
      "enum": ["hours", "days"]
    },
    "symptoms": {
      "type": [String], // Corrected: Use [String] for array of strings
      "default": []
    },
    "potentialTriggers": {
      "type": [String], // Corrected: Use [String]
      "default": []
    },
    "medicationsTaken": {
      "type": [String], // Corrected: Use [String]
      "default": []
    },
    "reliefMethods": {
      "type": [String], // Corrected: Use [String]
      "default": []
    },
    "sleepDisturbances": {
      "type": String,
      "enum": ["none", "difficulty falling asleep", "woke up frequently", "slept too little", "slept too much", "poor quality sleep"]
    },
    "hydrationLevel": {
      "type": String,
      "enum": ["well hydrated", "moderate", "poorly hydrated"]
    },
    "mealsSkipped": {
      "type": Boolean
    },
    "additionalNotes": {
      "type": String,
      "default": ""
    }
  },
  { 
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const MigraineEntry = mongoose.model("MigraineEntry", entrySchema); // Changed model name to be singular and more common practice

export default MigraineEntry;