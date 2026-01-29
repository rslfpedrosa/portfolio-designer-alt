import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rita Pedrosa - Product Designer',
  description: 'I design digital products that turn complexity into clarity.',
}

export default function HomeV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
