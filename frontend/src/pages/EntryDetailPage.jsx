import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Calendar, Clock, Activity, Edit, Trash2 } from "lucide-react";
import { formatDate, getSeverityColor, getSeverityBgColor } from "../lib/utils";

const EntryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/diary/migranes/${id}`);
        console.log("Entry data received:", res.data);
        console.log("CreatedAt:", res.data.createdAt);
        console.log("UpdatedAt:", res.data.updatedAt);
        setEntry(res.data);
      } catch (error) {
        console.error("Error fetching entry:", error);
        toast.error("Failed to load entry details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, navigate]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Not available';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format as dd/mm/yyyy
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this migraine entry?")) return;

    try {
      await api.delete(`/diary/migranes/delete/${id}`);
      toast.success("Entry deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading entry...</span>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 mt-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entry Not Found</h2>
            <p className="text-gray-600 mb-4">The migraine entry you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Entries
            </button>
          </div>
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
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Entries
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Migraine Entry Details</h1>
              <p className="text-gray-600 mt-2">
                {formatDate(new Date(entry.date))} at {entry.time}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/entry/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(new Date(entry.date))}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-lg font-semibold text-gray-900">{entry.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {entry.duration} {entry.durationUnit}
                </p>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Severity Level</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${getSeverityBgColor(entry.severity)} ${getSeverityColor(entry.severity)}`}>
              <span className="text-lg font-bold">{entry.severity}/10</span>
            </div>
          </div>

          {/* Symptoms */}
          {entry.symptoms && entry.symptoms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {entry.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Triggers */}
          {entry.potentialTriggers && entry.potentialTriggers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Potential Triggers</h3>
              <div className="flex flex-wrap gap-2">
                {entry.potentialTriggers.map((trigger, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {entry.medicationsTaken && entry.medicationsTaken.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medications Taken</h3>
              <div className="flex flex-wrap gap-2">
                {entry.medicationsTaken.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {medication}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Relief Methods */}
          {entry.reliefMethods && entry.reliefMethods.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Relief Methods</h3>
              <div className="flex flex-wrap gap-2">
                {entry.reliefMethods.map((method, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entry.sleepDisturbances && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleep Disturbances</h3>
                <p className="text-gray-700">{entry.sleepDisturbances}</p>
              </div>
            )}
            
            {entry.hydrationLevel && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hydration Level</h3>
                <p className="text-gray-700">{entry.hydrationLevel}</p>
              </div>
            )}
          </div>

          {/* Meals Skipped */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Meals Skipped</h3>
            <p className="text-gray-700">{entry.mealsSkipped ? "Yes" : "No"}</p>
          </div>

          {/* Additional Notes */}
          {entry.additionalNotes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="bg-base-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{entry.additionalNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryDetailPage;
