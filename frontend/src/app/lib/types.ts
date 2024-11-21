export interface NoteMetadata {
  session_date: string;
  client_name: string;
  note_type: string;
  template_id: string;
  content?: string;
  generated_response?: string;
  last_updated?: string;
}

export interface NoteResponse extends NoteMetadata {
  id: string;
}

export interface Template {
  name: string;
  structure: string;
}

export interface TemplateResponse extends Template {
  id: string;
}

export interface PromptRequest {
  template_id: string;
  note_id: string;
}

export interface PromptResponse {
  generated_note: string;
  template_used: string;
  timestamp: string;
  note_id: string;
}
