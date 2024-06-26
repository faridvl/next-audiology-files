/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ar1zNvbuu7k
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function DesktopSidebar() {
  return (
    <div className="flex h-full max-h-screen flex-col bg-background border-r border-muted/40 bg-success">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-primary">Acme Inc</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
            prefetch={false}
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

        </nav>
      </div>
    </div>
  )
}

function HomeIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function MountainIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

