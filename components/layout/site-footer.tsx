import Link from "next/link";
import { Home as HomeIcon, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-8 py-16">
        {/* Newsletter Section */}
        <div className="rounded-xl bg-muted/30 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for the latest properties and rental tips.
              </p>
            </div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 rounded-full px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button className="rounded-full">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <HomeIcon className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Neighbor</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover your next perfect home with Neighbor. We connect property owners with tenants, 
              making the rental process seamless and enjoyable for everyone.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Main Street, Suite 100<br />
                  San Francisco, CA 94105
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3" />
                <span className="text-sm text-muted-foreground">hello@neighbor.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">For Tenants</h3>
            <ul className="space-y-3">
              {[
                { href: "/properties", label: "Browse Properties" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/faq", label: "FAQ" },
                { href: "/tenant-resources", label: "Resources" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 text-primary group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">For Owners</h3>
            <ul className="space-y-3">
              {[
                { href: "/list-your-property", label: "List Your Property" },
                { href: "/landlord-resources", label: "Owner Resources" },
                { href: "/pricing", label: "Pricing" },
                { href: "/owner-faq", label: "FAQ for Owners" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 text-primary group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/careers", label: "Careers" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 text-primary group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Neighbor. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link 
              href="https://twitter.com" 
              className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link 
              href="https://facebook.com" 
              className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link 
              href="https://instagram.com" 
              className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link 
              href="https://linkedin.com" 
              className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 