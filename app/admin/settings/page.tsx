import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your newspaper settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your newspaper's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Newspaper Name</Label>
                <Input id="name" defaultValue="DailyBreakingTimes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" defaultValue="Your Source for Breaking News" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue="DailyBreakingTimes is your premier source for the latest news, in-depth analysis, and expert opinions on current events around the world."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="contact@dailybreakingtimes.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" defaultValue="https://facebook.com/dailybreakingtimes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue="https://twitter.com/dailybreakingtimes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" defaultValue="https://instagram.com/dailybreakingtimes" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of your newspaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="primary-color" type="color" defaultValue="#0070f3" className="w-16 h-10" />
                  <Input defaultValue="#0070f3" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="secondary-color" type="color" defaultValue="#f5f5f5" className="w-16 h-10" />
                  <Input defaultValue="#f5f5f5" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="accent-color" type="color" defaultValue="#ffcc00" className="w-16 h-10" />
                  <Input defaultValue="#ffcc00" className="flex-1" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Enable Dark Mode by Default</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure the layout of your newspaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="sticky-header" defaultChecked />
                <Label htmlFor="sticky-header">Sticky Header</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-breaking-news" defaultChecked />
                <Label htmlFor="show-breaking-news">Show Breaking News Ticker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-live-news" defaultChecked />
                <Label htmlFor="show-live-news">Show Live News Ticker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-weather" defaultChecked />
                <Label htmlFor="show-weather">Show Weather Widget</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="new-article" defaultChecked />
                <Label htmlFor="new-article">New Article Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="breaking-news" defaultChecked />
                <Label htmlFor="breaking-news">Breaking News Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="comment-reply" defaultChecked />
                <Label htmlFor="comment-reply">Comment Replies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="newsletter" defaultChecked />
                <Label htmlFor="newsletter">Weekly Newsletter</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Configure push notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="push-breaking-news" defaultChecked />
                <Label htmlFor="push-breaking-news">Breaking News Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-featured" />
                <Label htmlFor="push-featured">Featured Articles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-category" />
                <Label htmlFor="push-category">Category Updates</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for your newspaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="cache" defaultChecked />
                <Label htmlFor="cache">Enable Caching</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="analytics" defaultChecked />
                <Label htmlFor="analytics">Enable Analytics</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                <Input id="cache-duration" type="number" defaultValue="60" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Destructive actions for your newspaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="destructive">Clear Cache</Button>
                <p className="text-sm text-muted-foreground">
                  This will clear all cached data and may temporarily slow down your site.
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="destructive">Reset Settings</Button>
                <p className="text-sm text-muted-foreground">This will reset all settings to their default values.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
