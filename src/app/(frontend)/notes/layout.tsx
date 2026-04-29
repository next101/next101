import { Navbar } from '@/components/landing'
import { verifySession } from '@/lib/server'

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()

  return (
    <>
      <Navbar user={session.user} />
      {children}
    </>
  )
}
