"use client";

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
  Quote,
  Table,
  SeparatorHorizontal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ArticleEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ArticleEditor({
  initialValue = "",
  onChange,
  className = "",
}: ArticleEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const insertText = useCallback(
    (before: string, after = "", newline = false) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const prefix = newline ? "\n" : "";
      const suffix = newline ? "\n" : "";

      const newText =
        textarea.value.substring(0, start) +
        prefix +
        before +
        selectedText +
        after +
        suffix +
        textarea.value.substring(end);

      setValue(newText);
      onChange(newText);

      // Set cursor position after update
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + before.length + prefix.length;
        textarea.selectionEnd =
          start + before.length + prefix.length + selectedText.length;
      }, 0);
    },
    [onChange]
  );

  // Formatting functions
  const handleBold = () => insertText("**", "**");
  const handleItalic = () => insertText("*", "*");
  const handleH1 = () => insertText("# ", "", true);
  const handleH2 = () => insertText("## ", "", true);
  const handleH3 = () => insertText("### ", "", true);
  const handleList = () => insertText("- ", "", true);
  const handleOrderedList = () => insertText("1. ", "", true);
  const handleBlockquote = () => insertText("> ", "", true);
  const handleCode = () => insertText("```\n", "\n```", true);
  const handleHorizontalRule = () => insertText("\n---\n", "", true);

  const handleLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = textareaRef.current.value.substring(start, end);
        const linkText = selectedText || "link text";
        insertText(`[${linkText}](${url})`);
      }
    }
  };

  const handleImage = () => {
    const url = prompt("Enter image URL:", "https://");
    if (url) {
      const altText = prompt("Enter alt text for the image:", "");
      insertText(`![${altText || ""}](${url})`);
    }
  };

  const handleTable = () => {
    const tableMarkdown = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
    insertText(tableMarkdown, "", true);
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
    <div className={`border rounded-md bg-background ${className}`}>
      <Tabs
        defaultValue="edit"
        onValueChange={(val) => setIsPreview(val === "preview")}
      >
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
            onClick={handleBlockquote}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCode}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
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
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTable}
            title="Insert Table"
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHorizontalRule}
            title="Horizontal Rule"
          >
            <SeparatorHorizontal className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleUndo} title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo} title="Redo">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="p-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            className="w-full p-4 min-h-[400px] font-mono text-sm resize-y focus:outline-none bg-background"
            placeholder="Write your article content in Markdown..."
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0">
          <div className="p-6 min-h-[400px] prose max-w-none dark:prose-invert">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
