"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  LinkIcon,
  Code,
  Eye,
  Edit2,
  Undo,
  Redo,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface MarkdownEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({
  initialValue = "",
  onChange,
  className = "",
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const insertText = useCallback(
    (before: string, after = "") => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const newText =
        textarea.value.substring(0, start) +
        before +
        selectedText +
        after +
        textarea.value.substring(end);

      setValue(newText);
      onChange(newText);

      // Set cursor position after update
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + selectedText.length;
      }, 0);
    },
    [onChange]
  );

  const handleBold = () => insertText("**", "**");
  const handleItalic = () => insertText("*", "*");
  const handleH1 = () => insertText("# ");
  const handleH2 = () => insertText("## ");
  const handleH3 = () => insertText("### ");
  const handleList = () => insertText("- ");
  const handleOrderedList = () => insertText("1. ");
  const handleCode = () => insertText("```\n", "\n```");

  const handleLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = textareaRef.current.value.substring(start, end);
        const linkText = selectedText || "link text";
        insertText(`[${linkText}](${url})`, "");
      }
    }
  };

  const handleImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const file = target.files[0];
      try {
        setIsUploading(true);
        const imageUrl = await uploadToCloudinary(file);
        insertText(`![${file.name}](${imageUrl})`, "");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    fileInput.click();
  };

  const handleUndo = () => {
    if (!textareaRef.current) return;
    document.execCommand("undo");
  };

  const handleRedo = () => {
    if (!textareaRef.current) return;
    document.execCommand("redo");
  };

  return (
    <div className={`border rounded-md ${className}`}>
      <Tabs defaultValue="edit">
        <div className="border-b px-3 py-2 flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="p-0">
          <div className="border-b px-3 py-2 flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" onClick={handleBold} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleItalic}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleH1}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleH2}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleH3}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleList}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOrderedList}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLink}
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImage}
              disabled={isUploading}
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
              {isUploading && (
                <span className="ml-2 text-xs">Uploading...</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCode}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>
            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            className="w-full p-4 min-h-[400px] font-mono text-sm resize-y focus:outline-none"
            placeholder="Write your article content in Markdown..."
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="p-6 min-h-[400px] prose max-w-none">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
