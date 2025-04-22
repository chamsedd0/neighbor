import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Home as HomeIcon, Heart, Star, Users, Calendar } from "lucide-react";

const featuredProperties = [
  {
    id: 1,
    title: "Modern Loft in Downtown",
    location: "Portland, Oregon",
    price: 1800,
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    rating: 4.9,
    reviews: 48
  },
  {
    id: 2,
    title: "Luxury Condo with Ocean View",
    location: "Miami, Florida",
    price: 2400,
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    rating: 4.8,
    reviews: 36
  },
  {
    id: 3,
    title: "Charming Victorian Townhouse",
    location: "San Francisco, California",
    price: 2100,
    bedrooms: 2,
    bathrooms: 1.5,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    rating: 4.7,
    reviews: 29
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 z-0">
        <Image
            src="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
            alt="Beautiful home interior"
            fill
          priority
            className="object-cover brightness-[0.85]"
          />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="max-w-3xl bg-background/80 backdrop-blur-md p-8 rounded-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find Your Perfect <span className="text-primary">Long-Term Home</span>
              </h1>
              <p className="text-xl mb-8 text-foreground/80">
                Connect with trusted property owners and discover your ideal rental in premier locations.
              </p>
              <div className="bg-background shadow-lg rounded-full p-2 flex items-center mb-8">
                <div className="flex-1 flex items-center pl-4">
                  <Search className="h-5 w-5 text-muted-foreground mr-2" />
                  <input 
                    type="text" 
                    placeholder="Where are you looking to live?" 
                    className="w-full bg-transparent border-none focus:outline-none text-foreground py-2"
                  />
                </div>
                <Button className="rounded-full" size="lg">
                  <Search className="h-4 w-4 mr-2" /> Find Homes
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="lg" asChild className="rounded-full">
                  <Link href="/properties">Browse All Properties</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-full">
                  <Link href="/list-your-property">List Your Property</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-primary">Featured</span> Properties
            </h2>
            <Button variant="ghost" asChild className="group">
              <Link href="/properties" className="flex items-center">
                View All
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="group">
                <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
            <Image
                      src={property.image} 
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-colors">
                      <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({property.reviews})</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{property.location}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{property.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <HomeIcon className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p className="font-semibold text-lg">
                        ${property.price}
                        <span className="text-muted-foreground text-sm font-normal">/month</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories/Types Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Find Properties by <span className="text-primary">Category</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { name: "Apartments", icon: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
              { name: "Houses", icon: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
              { name: "Condos", icon: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
              { name: "Townhouses", icon: "https://images.unsplash.com/photo-1625602812206-5ec545ca1231?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
              { name: "Studios", icon: "https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
            ].map((category) => (
              <Link 
                key={category.name} 
                href={`/properties?type=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col items-center p-4 hover:shadow-md transition-all">
                  <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-3">
          <Image
                      src={category.icon} 
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-medium text-center group-hover:text-primary transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Neighbor Works</h2>
            <p className="text-lg text-muted-foreground">
              Our platform makes finding or listing long-term rental properties simple and secure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 relative z-10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute top-10 left-[60%] w-full h-0.5 bg-primary/20 hidden md:block"></div>
              <h3 className="text-xl font-semibold mb-3 text-center">Search Properties</h3>
              <p className="text-muted-foreground text-center">
                Browse our curated selection of long-term rental properties that match your criteria.
              </p>
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 relative z-10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute top-10 left-[60%] w-full h-0.5 bg-primary/20 hidden md:block"></div>
              <h3 className="text-xl font-semibold mb-3 text-center">Connect & Schedule</h3>
              <p className="text-muted-foreground text-center">
                Message property owners directly and schedule viewings that work with your timeline.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Move In</h3>
              <p className="text-muted-foreground text-center">
                Complete the application process and start enjoying your new home with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What Our <span className="text-primary">Users</span> Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Thompson",
                location: "New York",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
                quote: "Neighbor made finding my dream apartment so easy. The filters helped me narrow down exactly what I was looking for, and I was moved in within two weeks!"
              },
              {
                name: "Michael Rodriguez",
                location: "Chicago",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
                quote: "As a property owner, I love how simple it is to list my properties and connect with serious tenants. The platform handles all the details so I can focus on being a good landlord."
              },
              {
                name: "Jennifer Wu",
                location: "Los Angeles",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
                quote: "I've used other rental platforms before, but Neighbor has the best selection of quality long-term rentals. The direct messaging with owners made the process so much more personal."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image
                      src={testimonial.image} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Find Your New Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of happy tenants who found their perfect long-term rental with Neighbor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="rounded-full">
              <Link href="/register">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10 rounded-full">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
