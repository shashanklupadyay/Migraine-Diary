import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    severity: 5,
    duration: 1,
    durationUnit: "hours",
    symptoms: [],
    potentialTriggers: [],
    medicationsTaken: [],
    reliefMethods: [],
    sleepDisturbances: "",
    hydrationLevel: "",
    mealsSkipped: false,
    additionalNotes: ""
  });

  const [newSymptom, setNewSymptom] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newReliefMethod, setNewReliefMethod] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/diary/migranes/${id}`);
        const entry = res.data;
        
        // Format date for input field
        const date = new Date(entry.date).toISOString().split('T')[0];
        
        setFormData({
          date,
          time: entry.time,
          severity: entry.severity,
          duration: entry.duration,
          durationUnit: entry.durationUnit,
          symptoms: entry.symptoms || [],
          potentialTriggers: entry.potentialTriggers || [],
          medicationsTaken: entry.medicationsTaken || [],
          reliefMethods: entry.reliefMethods || [],
          sleepDisturbances: entry.sleepDisturbances || "",
          hydrationLevel: entry.hydrationLevel || "",
          mealsSkipped: entry.mealsSkipped || false,
          additionalNotes: entry.additionalNotes || ""
        });
      } catch (error) {
        console.error("Error fetching entry:", error);
        toast.error("Failed to load entry for editing");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addArrayItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/diary/migranes/update/${id}`, formData);
      toast.success("Migraine entry updated successfully!");
      navigate(`/entry/${id}`);
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Failed to update entry");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading entry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 mt-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/entry/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Entry
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Migraine Entry</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-base-100 rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity (1-10)</label>
              <input
                type="number"
                name="severity"
                min="1"
                max="10"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="number"
                name="duration"
                min="0.1"
                step="0.1"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration Unit</label>
              <select
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                placeholder="Add a symptom"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => addArrayItem('symptoms', newSymptom, setNewSymptom)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('symptoms', index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Triggers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Potential Triggers</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="Add a trigger"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => addArrayItem('potentialTriggers', newTrigger, setNewTrigger)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.potentialTriggers.map((trigger, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-2"
                >
                  {trigger}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('potentialTriggers', index)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medications Taken</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add a medication"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => addArrayItem('medicationsTaken', newMedication, setNewMedication)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medicationsTaken.map((medication, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                >
                  {medication}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('medicationsTaken', index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Relief Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relief Methods</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newReliefMethod}
                onChange={(e) => setNewReliefMethod(e.target.value)}
                placeholder="Add a relief method"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => addArrayItem('reliefMethods', newReliefMethod, setNewReliefMethod)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.reliefMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                >
                  {method}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('reliefMethods', index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Disturbances</label>
              <select
                name="sleepDisturbances"
                value={formData.sleepDisturbances}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select sleep disturbance</option>
                <option value="none">None</option>
                <option value="difficulty falling asleep">Difficulty falling asleep</option>
                <option value="woke up frequently">Woke up frequently</option>
                <option value="slept too little">Slept too little</option>
                <option value="slept too much">Slept too much</option>
                <option value="poor quality sleep">Poor quality sleep</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hydration Level</label>
              <select
                name="hydrationLevel"
                value={formData.hydrationLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select hydration level</option>
                <option value="well hydrated">Well hydrated</option>
                <option value="moderate">Moderate</option>
                <option value="poorly hydrated">Poorly hydrated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="mealsSkipped"
                checked={formData.mealsSkipped}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Meals Skipped</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes about this migraine episode..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/entry/${id}`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage; 