import { useState, useEffect } from "react";
import type { TemplateResponse } from "../lib/types";

interface TemplateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TemplateResponse) => any;
  template: TemplateResponse | null;
  onDelete?: (templateId: string) => Promise<void>;
}

const TemplateEditModal = ({
  isOpen,
  onClose,
  onSave,
  template,
  onDelete,
}: TemplateEditModalProps) => {
  const [editedTemplate, setEditedTemplate] = useState<TemplateResponse>({
    id: "",
    name: "",
    structure: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (template) {
      setEditedTemplate(template);
    } else {
      setEditedTemplate({
        id: "",
        name: "",
        structure: "",
      });
    }
  }, [template]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedTemplate);
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!template?.id || !onDelete) return;

    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        setIsDeleting(true);
        await onDelete(template.id);
        onClose();
      } catch (error) {
        console.error("Error deleting template:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {template ? "Edit Template" : "Create New Template"}
            </h2>
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
                Template Name
              </label>
              <input
                type="text"
                value={editedTemplate.name}
                onChange={(e) =>
                  setEditedTemplate({ ...editedTemplate, name: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Structure
              </label>

              <textarea
                value={editedTemplate.structure}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    structure: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md h-64 font-mono text-sm"
                placeholder="Enter template structure..."
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              {template && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                >
                  {isDeleting ? "Deleting..." : "Delete Template"}
                </button>
              )}
            </div>
            <div className="flex gap-4">
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
                {isSaving ? "Saving..." : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditModal;
