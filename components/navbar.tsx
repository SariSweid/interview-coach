// Navbar component — shown on every page
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  return (
    <nav className="w-full border-b border-border px-6 py-3 flex items-center justify-between">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-bold">Interview Coach</span>
        <Badge variant="outline" className="text-xs">Beta</Badge>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-4">
        <Link href="/setup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Practice
        </Link>
        <Link href="/summary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Last Session
        </Link>
      </div>

    </nav>
  )
}