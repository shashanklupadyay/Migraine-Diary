
import MigraineEntry from "../models/Entries.js"; // Ensure this path and model name are correct

// Get all migraine entries
export async function getEntries(req, res) {
  try {
    const entries = await MigraineEntry.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error in getEntries controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}




// Get a single migraine entry by ID
export async function getEntryById(req, res) {
  try {
    const { id } = req.params; // 1. Extract the ID from the request parameters

    const entry = await MigraineEntry.findById(id); // 2. Use Mongoose to find the entry by ID

    // 3. Handle cases where the entry is not found
    if (!entry) {
      // If no entry is found with that ID, send a 404 Not Found response
      return res.status(404).json({ message: "Migraine entry not found!" });
    }

    // Debug: Log the entry data to see what's being returned
    console.log("Entry found:", entry);
    console.log("CreatedAt:", entry.createdAt);
    console.log("UpdatedAt:", entry.updatedAt);
    console.log("Entry keys:", Object.keys(entry.toObject()));
    console.log("Entry as JSON:", JSON.stringify(entry, null, 2));

    // 4. If found, send the entry data back as JSON with a 200 OK status
    const entryData = entry.toObject();
    
    // Ensure timestamps are included, use current time as fallback if they don't exist
    entryData.createdAt = entry.createdAt || new Date();
    entryData.updatedAt = entry.updatedAt || new Date();
    
    console.log("Final response data:", JSON.stringify(entryData, null, 2));
    res.status(200).json(entryData);
  } catch (error) {
    // Catch any errors that occur during the database operation or ID parsing
    console.error("Error in getEntryById controller:", error);
    // Send a generic 500 Internal Server Error response
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add a new migraine entry
export async function addEntry(req, res) {
  try {
    // Destructure all fields from req.body according to your schema
    const {
      date,
      time,
      severity,
      duration,
      durationUnit,
      symptoms,
      potentialTriggers,
      medicationsTaken,
      reliefMethods,
      sleepDisturbances,
      hydrationLevel,
      mealsSkipped,
      additionalNotes,
    } = req.body;

    // Basic validation for required fields
    if (!date || !time || !severity || !duration || !durationUnit) {
      return res.status(400).json({ message: "Missing required fields: date, time, severity, duration, and durationUnit are mandatory." });
    }

    // Create a new MigraineEntry instance
    const newEntry = new MigraineEntry({
      date,
      time,
      severity,
      duration,
      durationUnit,
      symptoms,
      potentialTriggers,
      medicationsTaken,
      reliefMethods,
      sleepDisturbances,
      hydrationLevel,
      mealsSkipped,
      additionalNotes,
    });

    // Save the new entry to the database
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry); // 201 Created status
  } catch (error) {
    console.error("Error in addEntry controller:", error);
    // Mongoose validation errors often have a 'name' of 'ValidationError'
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}






// Update an existing migraine entry
export async function updateEntry(req, res) {
  try {
    const { id } = req.params; // Get ID from URL parameters

    // Destructure all fields from req.body that can be updated
    const {
      date,
      time,
      severity,
      duration,
      durationUnit,
      symptoms,
      potentialTriggers,
      medicationsTaken,
      reliefMethods,
      sleepDisturbances,
      hydrationLevel,
      mealsSkipped,
      additionalNotes,
    } = req.body;

    // Create an object with the fields to update
    const updateData = {
      date,
      time,
      severity,
      duration,
      durationUnit,
      symptoms,
      potentialTriggers,
      medicationsTaken,
      reliefMethods,
      sleepDisturbances,
      hydrationLevel,
      mealsSkipped,
      additionalNotes,
    };

    // Find and update the entry by ID
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validators run on update
    const updatedEntry = await MigraineEntry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Migraine entry not found!" });
    }

    res.status(200).json(updatedEntry); // Return the updated entry
  } catch (error) {
    console.error("Error in updateEntry controller:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}






// Delete a migraine entry
export async function deleteEntry(req, res) {
  try {
    const { id } = req.params; // Get ID from URL parameters

    const deletedEntry = await MigraineEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Migraine entry not found!" });
    }
    res.status(200).json({ message: "Migraine entry deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteEntry controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



