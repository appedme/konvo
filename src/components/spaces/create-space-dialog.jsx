'use client'

import { useState } from 'react'
import { useUser } from '@stackframe/stack'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Globe, Lock, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateSpaceDialog({ trigger }) {
  const user = useUser()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PUBLIC',
    rules: ''
  })

  const spaceTypes = [
    {
      value: 'PUBLIC',
      label: 'Public',
      description: 'Anyone can view and join',
      icon: Globe
    },
    {
      value: 'PRIVATE',
      label: 'Private',
      description: 'Invite only, posts need approval',
      icon: Lock
    },
    {
      value: 'UNLISTED',
      label: 'Unlisted',
      description: 'Anyone with link can join',
      icon: EyeOff
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          type: formData.type,
          rules: formData.rules.trim()
        }),
      })

      if (response.ok) {
        const space = await response.json()
        setIsOpen(false)
        setFormData({ name: '', description: '', type: 'PUBLIC', rules: '' })
        router.push(`/s/${space.slug}`)
      }
    } catch (error) {
      console.error('Error creating space:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Space
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Space</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Space Name</label>
            <Input
              placeholder="Enter space name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              maxLength={50}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="What's this space about?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/200 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Privacy Type</label>
            <div className="space-y-2">
              {spaceTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-colors ${
                    formData.type === type.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <type.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Rules (Optional)</label>
            <Textarea
              placeholder="Community guidelines and rules"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.rules.length}/500 characters
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.name.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Space'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
