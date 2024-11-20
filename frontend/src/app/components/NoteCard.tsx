// components/NoteEditModal.tsx
"use client";

import { useEffect, useState } from "react";
import type {
  NoteResponse,
  TemplateResponse,
  NoteMetadata,
} from "../lib/types";
import { promptApi } from "../lib/api";

interface NoteEditModalProps {
  note: NoteResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: NoteResponse) => Promise<void>;
  templates: TemplateResponse[];
}

const NoteEditModal = ({
  note,
  isOpen,
  onClose,
  onSave,
  templates,
}: NoteEditModalProps) => {
  const [editedNote, setEditedNote] = useState<NoteResponse>({
    id: "",
    client_name: "",
    session_date: new Date().toISOString().split("T")[0],
    note_type: "Progress",
    template_id: "",
    content: "",
    generated_response: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (note) {
      setEditedNote({
        id: note.id,
        client_name: note.client_name,
        session_date: new Date(note.session_date).toISOString().split("T")[0],
        note_type: note.note_type,
        template_id: note.template_id,
        content: note.content,
        generated_response: note.generated_response || "",
      });
    }
  }, [note]);

  const generateNoteResponse = async (noteId: string, templateId: string) => {
    try {
      const response = await promptApi.generateResponse({
        template_id: templateId,
        note_id: noteId,
      });

      return response.generated_note;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedNote);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!editedNote.id || !editedNote.template_id) return;

    try {
      setIsGenerating(true);
      const generatedResponse = await generateNoteResponse(
        editedNote.id,
        editedNote.template_id
      );
      setEditedNote((prev) => ({
        ...prev,
        generated_response: generatedResponse,
      }));
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderFormattedText = (text: string | undefined) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => {
      const formattedLine = line.split(/(\*[^*]+\*)/).map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          return <strong key={i}>{part.slice(1, -1)}</strong>;
        }
        return part;
      });

      return (
        <span key={index}>
          {formattedLine}
          {index < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Note</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={editedNote.client_name}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    client_name: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Date
              </label>
              <input
                type="date"
                value={editedNote.session_date}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    session_date: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note Type
              </label>
              <select
                value={editedNote.note_type}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    note_type: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="Intake">Intake</option>
                <option value="Progress">Progress</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                value={editedNote.template_id}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    template_id: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              >
                {templates?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note Content
              </label>
              <textarea
                value={editedNote.content}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    content: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md min-h-32"
              />
            </div>

            <div>
              <div className="flex justify-between p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generated Response
                </label>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                >
                  {isGenerating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isGenerating ? "Generating..." : "Re-Generate Response"}
                </button>
              </div>
              {/* <div className="mb-2 p-4 border rounded bg-gray-50">
                {renderFormattedText(editedNote.generated_response)}
              </div> */}
              <textarea
                value={editedNote.generated_response}
                onChange={(e) =>
                  setEditedNote({
                    ...editedNote,
                    generated_response: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md h-80"
                placeholder="Edit generated response..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditModal;
