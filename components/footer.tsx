import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-8 mx-auto md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">RZ Amin</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted property specialist in Tawau, Sabah. Find your dream home with expert guidance and local
              knowledge.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-primary" prefetch={true}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties?category=For Sale" className="transition-colors hover:text-primary" prefetch={true}>
                  Properties For Sale
                </Link>
              </li>
              <li>
                <Link href="/properties?category=For Rent" className="transition-colors hover:text-primary" prefetch={true}>
                  Properties For Rent
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary" prefetch={true}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=Residential" className="transition-colors hover:text-primary">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Commercial" className="transition-colors hover:text-primary">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Land" className="transition-colors hover:text-primary">
                  Land
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>+60 11-6362 4997</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>rzaminproperty@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Tawau, Sabah, Malaysia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center border-t text-muted-foreground">
          &copy; {new Date().getFullYear()} RZ Amin. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
