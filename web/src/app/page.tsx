"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Code2, 
  Smartphone, 
  Database, 
  Bot, 
  Zap, 
  ShoppingCart,
  Search,
  ArrowRight,
  Check,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { VideoConverter } from "@/components/video-converter";

export default function Home() {
  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Next.js 15 + TypeScript",
      description: "Latest React framework with full TypeScript support"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "React Native + Expo",
      description: "Cross-platform mobile apps with shared code"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Supabase + Prisma",
      description: "PostgreSQL with real-time features and type-safe ORM"
    },
    {
      icon: <Bot className="w-5 h-5" />,
      title: "AI Integration",
      description: "Claude API with streaming responses via Vercel AI SDK"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechStart",
      avatar: "SC",
      content: "This stack helped us launch our MVP in just 2 weeks. The AI integration is seamless!"
    },
    {
      name: "Mike Johnson",
      role: "Founder of PartsPro",
      avatar: "MJ",
      content: "Perfect for our e-commerce needs. Prisma + Supabase combo is incredibly powerful."
    },
    {
      name: "Emma Wilson",
      role: "Lead Developer",
      avatar: "EW",
      content: "shadcn/ui components saved us months of design work. Beautiful and functional!"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/jam-hero.webm`} type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          
          {/* Subtle black overlay for text readability */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Powered by the Unified Stack
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Build <span className="text-primary">Beautiful Apps</span> with
              <br />Modern Tech Stack
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From idea to production in record time. Web, mobile, and AI - all in one unified development experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Build
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Demo Section with Tabs */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            See It In Action
          </h2>
          
          <Tabs defaultValue="ecommerce" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
              <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
              <TabsTrigger value="video-converter">Video Converter</TabsTrigger>
              <TabsTrigger value="mobile">Mobile App</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ecommerce">
              <Card>
                <CardHeader>
                  <CardTitle>Parts Store Example</CardTitle>
                  <CardDescription>
                    Complete e-commerce solution with Prisma + Supabase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search for parts..." className="flex-1" />
                    <Button>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Brake Pad Set</CardTitle>
                          <Badge>In Stock</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$89.99</p>
                        <p className="text-sm text-muted-foreground">SKU: BP-12345</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Oil Filter</CardTitle>
                          <Badge variant="secondary">Low Stock</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$12.99</p>
                        <p className="text-sm text-muted-foreground">SKU: OF-67890</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-chat">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Powered by Claude with streaming responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold">User</p>
                        <Card className="bg-muted">
                          <CardContent className="p-3">
                            <p className="text-sm">I need brake pads for a 2020 Honda Civic</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold">AI Assistant</p>
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-sm mb-2">
                              I found the perfect brake pads for your 2020 Honda Civic:
                            </p>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-green-600" />
                                Premium Ceramic Brake Pads - $89.99
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-green-600" />
                                Direct OEM replacement
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-green-600" />
                                2-year warranty included
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="video-converter">
              <VideoConverter />
            </TabsContent>
            
            <TabsContent value="mobile">
              <Card>
                <CardHeader>
                  <CardTitle>React Native + Expo</CardTitle>
                  <CardDescription>
                    Cross-platform mobile app with shared code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <Smartphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">Mobile App Preview</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Same components, same data, native performance
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="outline">iOS</Badge>
                      <Badge variant="outline">Android</Badge>
                      <Badge variant="outline">Web</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Loved by Developers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of developers building with the Unified Stack. 
              Get started in minutes, scale to millions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:text-primary-foreground/80">
                Star on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
