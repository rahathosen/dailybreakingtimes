"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TipTapEditor } from "@/components/tiptap-editor"

export default function NewArticlePage() {
  const [articleContent, setArticleContent] = useState("<p>Start writing your article here...</p>")

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Article</h1>
        <p className="text-muted-foreground">Create a new news article</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for the article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter article title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="article-slug" />
                <p className="text-xs text-muted-foreground">
                  The slug is used in the URL. It should be lowercase with hyphens instead of spaces.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" placeholder="Brief summary of the article" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="opinion">Opinion</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select>
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breaking">Breaking</SelectItem>
                      <SelectItem value="world">World</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="politics">Politics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">News Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select news type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breaking-news">Breaking News</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="opinion">Opinion</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image here, or click to select a file
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Select Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>Write or paste the full article content</CardDescription>
            </CardHeader>
            <CardContent>
              <TipTapEditor content={articleContent} onChange={setArticleContent} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
              <CardDescription>Configure additional settings for the article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="is_breaking" />
                <Label htmlFor="is_breaking">Mark as Breaking News</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_highlighted" />
                <Label htmlFor="is_highlighted">Highlight Article</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="Enter tags separated by commas" />
                <p className="text-xs text-muted-foreground">Tags help users find related content</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_at">Publish Date</Label>
                <Input id="published_at" type="datetime-local" />
                <p className="text-xs text-muted-foreground">Leave empty to publish immediately</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Article</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
