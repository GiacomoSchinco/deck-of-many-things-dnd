// app/test/ancient-container/page.tsx
'use client'

import AncientContainer from '@/components/custom/AncientContainer'

export default function TestAncientContainerPage() {
  return (
    <div className="container mx-auto p-8">
      <AncientContainer title="Hello World">
        <p className="text-amber-800">Hello World! 🏺</p>
      </AncientContainer>
    </div>
  )
}