import { PenSquareIcon, Trash2Icon, Clock, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, getSeverityColor, getSeverityBgColor } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const EntryCard = ({ entry, onDelete }) => {
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this migraine entry?")) return;

    try {
      await api.delete(`/diary/migranes/delete/${entry._id}`);
      onDelete(entry._id);
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const formatTime = (time) => {
    return time;
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-primary overflow-hidden">
      <Link to={`/entry/${entry._id}`} className="block p-6">
        {/* Header with date and severity */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-base-content/60" />
            <span className="font-semibold text-base-content">
              {formatDate(new Date(entry.date))}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityBgColor(entry.severity)} ${getSeverityColor(entry.severity)}`}>
            {entry.severity}/10
          </div>
        </div>

        {/* Time and Duration */}
        <div className="flex items-center gap-4 mb-3 text-sm text-base-content/70">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(entry.time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            <span>{entry.duration} {entry.durationUnit}</span>
          </div>
        </div>

        {/* Symptoms */}
        {entry.symptoms && entry.symptoms.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-base-content/80 mb-1">Symptoms:</p>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {entry.symptoms.join(", ")}
            </p>
          </div>
        )}

        {/* Triggers */}
        {entry.potentialTriggers && entry.potentialTriggers.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-base-content/80 mb-1">Triggers:</p>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {entry.potentialTriggers.join(", ")}
            </p>
          </div>
        )}

        {/* Additional Notes */}
        {entry.additionalNotes && (
          <div className="mb-4">
            <p className="text-sm font-medium text-base-content/80 mb-1">Notes:</p>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {truncateText(entry.additionalNotes, 80)}
            </p>
          </div>
        )}

        {/* Footer with actions */}
        <div className="flex justify-between items-center pt-3 border-t border-base-300">
          <div className="flex gap-2">
            {entry.medicationsTaken && entry.medicationsTaken.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {entry.medicationsTaken.length} medication(s)
              </span>
            )}
            {entry.reliefMethods && entry.reliefMethods.length > 0 && (
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                {entry.reliefMethods.length} relief method(s)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to={`/entry/${entry._id}/edit`}
              className="p-1 text-base-content/40 hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <PenSquareIcon className="w-4 h-4" />
            </Link>
            <button
              className="p-1 text-base-content/40 hover:text-error transition-colors"
              onClick={handleDelete}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EntryCard;