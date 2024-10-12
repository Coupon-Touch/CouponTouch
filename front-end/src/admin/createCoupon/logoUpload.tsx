import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LogoUpload() {
  const [logo, setLogo] = useState<File | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0])
    }
  }

  return (
    <div>
      <Label htmlFor="logo">Logo Upload</Label>
      <Input id="logo" type="file" onChange={handleLogoUpload} />
      {logo && <p className="mt-2">Logo uploaded: {logo.name}</p>}
    </div>
  )
}