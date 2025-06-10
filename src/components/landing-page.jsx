'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Users, 
  Shield, 
  Zap,
  Heart,
  Star
} from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Open Conversations",
      description: "Engage in meaningful discussions without restrictions or heavy-handed moderation."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Community",
      description: "Create public, private, or unlisted spaces tailored to your community's needs."
    },
    {
      icon: Clock,
      title: "Modern & Clean",
      description: "Enjoy a beautiful, fast, and intuitive interface designed for great conversations."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data belongs to you. We prioritize user privacy and minimal data collection."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Shape the platform's future."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance. No more waiting for pages to load."
    }
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Tech Community Leader",
      content: "Finally, a platform that doesn't censor every discussion. Konvo brings back real conversations.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "The clean interface and powerful community tools make Konvo perfect for my audience.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Startup Founder",
      content: "We moved our entire community to Konvo. The private spaces feature is exactly what we needed.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your People.
              <br />
              Start Your Space.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join Konvo, the modern community platform where you can create, join, and grow Spaces — 
              safe environments for open, unrestricted conversation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Spaces</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Konvo?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology and community-first principles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What People Are Saying</h2>
            <p className="text-muted-foreground">
              Join thousands of users who have made Konvo their home
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users building meaningful communities on Konvo
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">
              <Heart className="h-5 w-5 mr-2" />
              Join Konvo Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="font-bold">Konvo</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Konvo. Built for the community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
