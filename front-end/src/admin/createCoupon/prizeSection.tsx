import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Prize {
  image: File | null
  bias: number
}

export default function PrizeSection() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [losingImage, setLosingImage] = useState<File | null>(null)

  const handleAddPrize = () => {
    setPrizes([...prizes, { image: null, bias: 0 }])
  }

  const handlePrizeImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newPrizes = [...prizes]
      newPrizes[index].image = event.target.files[0]
      setPrizes(newPrizes)
    }
  }

  const handlePrizeBiasChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrizes = [...prizes]
    newPrizes[index].bias = Number(event.target.value)
    setPrizes(newPrizes)
  }

  const handleLosingImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLosingImage(event.target.files[0])
    }
  }

  return (
    <div>
      <Button onClick={handleAddPrize}>Add Prize</Button>
      {prizes.map((prize, index) => (
        <Card key={index} className="mt-4">
          <CardHeader>
            <CardTitle>Prize {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor={`prizeImage-${index}`}>Prize Image</Label>
              <Input id={`prizeImage-${index}`} type="file" onChange={(e) => handlePrizeImageUpload(index, e)} />
            </div>
            <div className="mt-2">
              <Label htmlFor={`prizeBias-${index}`}>Prize Bias (out of 100)</Label>
              <Input
                id={`prizeBias-${index}`}
                type="number"
                min="0"
                max="100"
                value={prize.bias}
                onChange={(e) => handlePrizeBiasChange(index, e)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="mt-4">
        <Label htmlFor="losingImage">Losing Image</Label>
        <Input id="losingImage" type="file" onChange={handleLosingImageUpload} />
      </div>
    </div>
  )
}