"use client";

import { useState, useEffect } from "react";
import { notesApi, templatesApi, promptApi } from "./lib/api";
import type {
  NoteMetadata,
  TemplateResponse,
  NoteResponse,
  PromptResponse,
} from "./lib/types";
import NoteEditModal from "./components/NoteCard";
import TemplateEditModal from "./components/TemplateEditModal";

interface NoteState {
  id: string;
  isLoading: boolean;
  generatedResponse?: string;
}

interface TemplateState {
  selectedTemplate: TemplateResponse | null;
  isModalOpen: boolean;
}

export default function NoteTakingPage() {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [noteStates, setNoteStates] = useState<Record<string, NoteState>>({});
  console.log(noteStates);
  const [clientName, setClientName] = useState("");
  const [noteType, setNoteType] = useState("progress");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [selectedNote, setSelectedNote] = useState<NoteResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateState, setTemplateState] = useState<TemplateState>({
    selectedTemplate: null,
    isModalOpen: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, notesData] = await Promise.all([
          templatesApi.getAllTemplates(),
          notesApi.getAllNotes(),
        ]);
        setTemplates(templatesData);
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCreateTemplate = () => {
    setTemplateState({
      selectedTemplate: null,
      isModalOpen: true,
    });
  };

  const handleSaveTemplate = async (template: TemplateResponse) => {
    try {
      let savedTemplate;
      if (template.id) {
        savedTemplate = await templatesApi.updateTemplate(
          template.id,
          template
        );
      } else {
        savedTemplate = await templatesApi.createTemplate(template);
      }

      const updatedTemplates = await templatesApi.getAllTemplates();
      setTemplates(updatedTemplates);

      return savedTemplate;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  };

  const handleEditTemplate = (template: TemplateResponse) => {
    setTemplateState({
      selectedTemplate: template,
      isModalOpen: true,
    });
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await templatesApi.deleteTemplate(templateId);
      const updatedTemplates = await templatesApi.getAllTemplates();
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  };

  const handleUpdateNote = async (updatedNote: NoteResponse) => {
    try {
      await notesApi.updateNote(updatedNote.id, updatedNote);
      const updatedNotes = await notesApi.getAllNotes();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleContentChange = (content: string) => {
    setNoteContent(content);
    setWordCount(content.trim().split(/\s+/).length);
  };

  const generateNoteResponse = async (noteId: string, templateId: string) => {
    setNoteStates((prev) => ({
      ...prev,
      [noteId]: { ...prev[noteId], id: noteId, isLoading: true },
    }));

    try {
      const response = await promptApi.generateResponse({
        template_id: templateId,
        note_id: noteId,
      });

      setNoteStates((prev) => ({
        ...prev,
        [noteId]: {
          id: noteId,
          isLoading: false,
          generatedResponse: response.generated_note,
        },
      }));
    } catch (error) {
      console.error("Error generating response:", error);
      setNoteStates((prev) => ({
        ...prev,
        [noteId]: { ...prev[noteId], isLoading: false },
      }));
    }
  };

  const handleUpload = async () => {
    if (!clientName.trim()) {
      alert("Please enter a client name");
      return;
    }

    if (wordCount < 100 || wordCount > 1000) {
      alert("Note content must be between 100 and 1000 words");
      return;
    }

    try {
      const noteData: NoteMetadata = {
        session_date: sessionDate,
        client_name: clientName.trim(),
        note_type: noteType,
        template_id: selectedTemplate,
        content: noteContent,
      };

      const newNote = await notesApi.createNote(noteData);
      setNotes((prev) => [newNote, ...prev]);

      await generateNoteResponse(newNote.id, selectedTemplate);

      setNoteContent("");
      setClientName("");
      setSessionDate(new Date().toISOString().split("T")[0]);
      setNoteType("");
      setSelectedTemplate("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* Left side - Note Creation */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Create Note</h1>

          {/* Form Controls */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Note Type
              </label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1"
              >
                <option value="Intake">Intake</option>
                <option value="Progress">Progress</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Template
                </label>
                <div>
                  <button
                    onClick={handleCreateTemplate}
                    className="text-sm text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Create New
                  </button>
                  {selectedTemplate && (
                    <button
                      onClick={() => {
                        const template = templates.find(
                          (t) => t.id === selectedTemplate
                        );
                        if (template) {
                          handleEditTemplate(template);
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit Selected
                    </button>
                  )}
                </div>
              </div>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note Content */}
          <div>
            <textarea
              value={noteContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your note here..."
            />
            <p
              className={`text-sm mt-2 ${
                wordCount < 10 || wordCount > 1000
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              Word count: {wordCount} (must be between 10 and 1000 words)
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={!clientName.trim() || wordCount < 10 || wordCount > 1000}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Upload Note
          </button>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Notes</h2>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {notes.map((note) => (
              <div
                key={note.id}
                className="mb-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedNote(note);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    Session with {note.client_name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(note.session_date).toLocaleDateString()}
                    </span>
                    {noteStates[note.id]?.isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Type: {note.note_type}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                  {note.content}
                </p>

                {(noteStates[note.id]?.generatedResponse ||
                  note?.generated_response) && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700">
                      Generated Response:
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {noteStates[note.id]?.generatedResponse ||
                        note?.generated_response}
                    </p>
                  </div>
                )}

                {/* {!noteStates[note.id]?.generatedResponse &&
                  !noteStates[note.id]?.isLoading && (
                    <button
                      onClick={() =>
                        generateNoteResponse(note.id, note.template_id)
                      }
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Generate Response
                    </button>
                  )} */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <NoteEditModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleUpdateNote}
        templates={templates}
      />
      <TemplateEditModal
        isOpen={templateState.isModalOpen}
        onClose={() =>
          setTemplateState({ selectedTemplate: null, isModalOpen: false })
        }
        onSave={handleSaveTemplate}
        template={templateState.selectedTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
}
