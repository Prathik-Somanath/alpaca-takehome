import {
  NoteResponse,
  NoteMetadata,
  TemplateResponse,
  Template,
  PromptRequest,
  PromptResponse,
} from "./types";

const API_BASE_URL = "http://localhost:8000/api";

// API errors
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const notesApi = {
  // Get all notes
  async getAllNotes(): Promise<NoteResponse[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch notes");
    }
    return response.json();
  },

  // Get a specific note
  async getNote(noteId: string): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch note");
    }
    return response.json();
  },

  // Create a new note
  async createNote(note: NoteMetadata): Promise<NoteResponse> {
    console.log("called", note);
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to create note");
    }
    return response.json();
  },

  // Update a new note
  async updateNote(
    noteId: string,
    updateNote: NoteResponse
  ): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateNote),
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to update note");
    }
    return response.json();
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to delete note");
    }
    return response.json();
  },
};

export const templatesApi = {
  // Get all templates
  async getAllTemplates(): Promise<TemplateResponse[]> {
    const response = await fetch(`${API_BASE_URL}/templates`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch templates");
    }
    return response.json();
  },

  // Get a specific template
  async getTemplate(templateId: string): Promise<TemplateResponse> {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch template");
    }
    return response.json();
  },

  // Create a new template
  async createTemplate(template: Template): Promise<TemplateResponse> {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to create template");
    }
    return response.json();
  },

  // Update a template
  async updateTemplate(
    templateId: string,
    template: Template
  ): Promise<TemplateResponse> {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to update template");
    }
    return response.json();
  },

  // Delete a template
  async deleteTemplate(templateId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to delete template");
    }
    return response.json();
  },
};

// Generate note
export const promptApi = {
  generateResponse: async (request: PromptRequest): Promise<PromptResponse> => {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to generate response");
    }

    return response.json();
  },
};
