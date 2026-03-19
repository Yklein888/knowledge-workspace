import { ReactNode } from 'react'

export const metadata = {
  title: 'Workspace - Knowledge',
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar will be added here */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
