'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Server,
  Shield,
  Mail,
  Globe,
  Database,
  Zap,
  AlertTriangle,
  Check,
  Save,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedChanges, setSavedChanges] = useState(false)

  useEffect(() => {
    // Fetch current settings
    const fetchSettings = async () => {
      try {
        // Mock data - in production, fetch from your API
        const mockSettings = {
          general: {
            siteName: 'Konvo',
            siteDescription: 'A modern community platform for meaningful conversations',
            siteUrl: 'https://konvo.com',
            contactEmail: 'admin@konvo.com',
            supportEmail: 'support@konvo.com',
            timezone: 'UTC',
            language: 'en',
            allowUserRegistration: true,
            requireEmailVerification: true,
            enableMaintenance: false
          },
          security: {
            requireStrongPasswords: true,
            enableTwoFactor: false,
            sessionTimeout: 24,
            maxLoginAttempts: 5,
            enableCaptcha: true,
            allowedDomains: '',
            blockedDomains: 'spam.com, fake.com',
            enableIPBlocking: false
          },
          content: {
            enablePostModeration: true,
            autoModeration: false,
            spamDetection: true,
            profanityFilter: true,
            maxPostLength: 5000,
            maxCommentLength: 1000,
            allowFileUploads: true,
            maxFileSize: 10,
            allowedFileTypes: 'jpg, png, gif, pdf, doc, docx'
          },
          notifications: {
            enableEmailNotifications: true,
            enablePushNotifications: false,
            dailyDigest: true,
            weeklyReport: true,
            moderationAlerts: true,
            systemAlerts: true,
            emailProvider: 'sendgrid',
            smtpHost: '',
            smtpPort: 587,
            smtpUsername: '',
            smtpPassword: ''
          },
          features: {
            enableSpaces: true,
            enableVerification: true,
            enableAnalytics: true,
            enableAPI: false,
            enableWebhooks: false,
            enableSSO: false,
            enableDarkMode: true,
            enableSearchIndexing: true
          }
        }
        setSettings(mockSettings)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching settings:', error)
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Mock API call - implement actual settings save
      console.log('Saving settings:', settings)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSavedChanges(true)
      setTimeout(() => setSavedChanges(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async (type) => {
    // Mock connection test
    console.log(`Testing ${type} connection...`)
    // Implement actual connection tests
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your Konvo community platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {savedChanges && (
            <Badge className="bg-green-500 gap-2">
              <Check className="h-4 w-4" />
              Changes saved
            </Badge>
          )}
          <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.general.siteUrl}
                    onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => handleSettingChange('general', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={settings.general.language} onValueChange={(value) => handleSettingChange('general', 'language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRegistration">Allow User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                  </div>
                  <Switch
                    id="allowRegistration"
                    checked={settings.general.allowUserRegistration}
                    onCheckedChange={(checked) => handleSettingChange('general', 'allowUserRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Users must verify their email before accessing the platform</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={settings.general.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange('general', 'requireEmailVerification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable maintenance mode to temporarily disable the site</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.enableMaintenance}
                    onCheckedChange={(checked) => handleSettingChange('general', 'enableMaintenance', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="strongPasswords">Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">Enforce password complexity requirements</p>
                  </div>
                  <Switch
                    id="strongPasswords"
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => handleSettingChange('security', 'requireStrongPasswords', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Allow users to enable 2FA for enhanced security</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="captcha">Enable CAPTCHA</Label>
                    <p className="text-sm text-muted-foreground">Use CAPTCHA to prevent automated registrations</p>
                  </div>
                  <Switch
                    id="captcha"
                    checked={settings.security.enableCaptcha}
                    onCheckedChange={(checked) => handleSettingChange('security', 'enableCaptcha', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="allowedDomains">Allowed Email Domains (optional)</Label>
                  <Input
                    id="allowedDomains"
                    placeholder="company.com, university.edu"
                    value={settings.security.allowedDomains}
                    onChange={(e) => handleSettingChange('security', 'allowedDomains', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Comma-separated list of allowed email domains</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockedDomains">Blocked Email Domains</Label>
                  <Input
                    id="blockedDomains"
                    placeholder="spam.com, tempmail.org"
                    value={settings.security.blockedDomains}
                    onChange={(e) => handleSettingChange('security', 'blockedDomains', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Comma-separated list of blocked email domains</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Content Moderation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="postModeration">Enable Post Moderation</Label>
                    <p className="text-sm text-muted-foreground">Require manual approval for new posts</p>
                  </div>
                  <Switch
                    id="postModeration"
                    checked={settings.content.enablePostModeration}
                    onCheckedChange={(checked) => handleSettingChange('content', 'enablePostModeration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoModeration">Auto-Moderation</Label>
                    <p className="text-sm text-muted-foreground">Automatically flag potentially problematic content</p>
                  </div>
                  <Switch
                    id="autoModeration"
                    checked={settings.content.autoModeration}
                    onCheckedChange={(checked) => handleSettingChange('content', 'autoModeration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="spamDetection">Spam Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect and filter spam content</p>
                  </div>
                  <Switch
                    id="spamDetection"
                    checked={settings.content.spamDetection}
                    onCheckedChange={(checked) => handleSettingChange('content', 'spamDetection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profanityFilter">Profanity Filter</Label>
                    <p className="text-sm text-muted-foreground">Filter inappropriate language</p>
                  </div>
                  <Switch
                    id="profanityFilter"
                    checked={settings.content.profanityFilter}
                    onCheckedChange={(checked) => handleSettingChange('content', 'profanityFilter', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="maxPostLength">Max Post Length (characters)</Label>
                  <Input
                    id="maxPostLength"
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.content.maxPostLength}
                    onChange={(e) => handleSettingChange('content', 'maxPostLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCommentLength">Max Comment Length (characters)</Label>
                  <Input
                    id="maxCommentLength"
                    type="number"
                    min="50"
                    max="2000"
                    value={settings.content.maxCommentLength}
                    onChange={(e) => handleSettingChange('content', 'maxCommentLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowFileUploads">Allow File Uploads</Label>
                    <p className="text-sm text-muted-foreground">Allow users to upload files in posts</p>
                  </div>
                  <Switch
                    id="allowFileUploads"
                    checked={settings.content.allowFileUploads}
                    onCheckedChange={(checked) => handleSettingChange('content', 'allowFileUploads', checked)}
                  />
                </div>

                {settings.content.allowFileUploads && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.content.maxFileSize}
                        onChange={(e) => handleSettingChange('content', 'maxFileSize', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                      <Input
                        id="allowedFileTypes"
                        placeholder="jpg, png, gif, pdf"
                        value={settings.content.allowedFileTypes}
                        onChange={(e) => handleSettingChange('content', 'allowedFileTypes', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.enableEmailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'enableEmailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.enablePushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'enablePushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dailyDigest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">Send daily activity summaries</p>
                  </div>
                  <Switch
                    id="dailyDigest"
                    checked={settings.notifications.dailyDigest}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'dailyDigest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="moderationAlerts">Moderation Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify admins of content requiring review</p>
                  </div>
                  <Switch
                    id="moderationAlerts"
                    checked={settings.notifications.moderationAlerts}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'moderationAlerts', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select value={settings.notifications.emailProvider} onValueChange={(value) => handleSettingChange('notifications', 'emailProvider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.notifications.emailProvider === 'smtp' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={settings.notifications.smtpHost}
                        onChange={(e) => handleSettingChange('notifications', 'smtpHost', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.notifications.smtpPort}
                        onChange={(e) => handleSettingChange('notifications', 'smtpPort', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.notifications.smtpUsername}
                        onChange={(e) => handleSettingChange('notifications', 'smtpUsername', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.notifications.smtpPassword}
                        onChange={(e) => handleSettingChange('notifications', 'smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={() => testConnection('email')} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSpaces">Spaces</Label>
                      <p className="text-sm text-muted-foreground">Allow community spaces</p>
                    </div>
                    <Switch
                      id="enableSpaces"
                      checked={settings.features.enableSpaces}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableSpaces', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableVerification">Verification Badges</Label>
                      <p className="text-sm text-muted-foreground">User and space verification</p>
                    </div>
                    <Switch
                      id="enableVerification"
                      checked={settings.features.enableVerification}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableVerification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAnalytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">Track platform metrics</p>
                    </div>
                    <Switch
                      id="enableAnalytics"
                      checked={settings.features.enableAnalytics}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableAnalytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableDarkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Allow theme switching</p>
                    </div>
                    <Switch
                      id="enableDarkMode"
                      checked={settings.features.enableDarkMode}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableDarkMode', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAPI">API Access</Label>
                      <p className="text-sm text-muted-foreground">Enable REST API</p>
                    </div>
                    <Switch
                      id="enableAPI"
                      checked={settings.features.enableAPI}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableAPI', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableWebhooks">Webhooks</Label>
                      <p className="text-sm text-muted-foreground">Send event webhooks</p>
                    </div>
                    <Switch
                      id="enableWebhooks"
                      checked={settings.features.enableWebhooks}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableWebhooks', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSSO">Single Sign-On</Label>
                      <p className="text-sm text-muted-foreground">SAML/OAuth integration</p>
                    </div>
                    <Switch
                      id="enableSSO"
                      checked={settings.features.enableSSO}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableSSO', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSearchIndexing">Search Indexing</Label>
                      <p className="text-sm text-muted-foreground">Allow search engine crawling</p>
                    </div>
                    <Switch
                      id="enableSearchIndexing"
                      checked={settings.features.enableSearchIndexing}
                      onCheckedChange={(checked) => handleSettingChange('features', 'enableSearchIndexing', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
