import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CouponInformation() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [terms, setTerms] = useState('')
  const [congratulations, setCongratulations] = useState('')

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="couponTitle">Coupon Title</Label>
        <Input
          id="couponTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter coupon title"
        />
      </div>
      <div>
        <Label htmlFor="couponSubtitle">Coupon Subtitle</Label>
        <Input
          id="couponSubtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Enter coupon subtitle"
        />
      </div>
      <div>
        <Label htmlFor="description">Description Text</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="Enter terms and conditions"
        />
      </div>
      <div>
        <Label htmlFor="congratulations">Congratulations Description</Label>
        <Textarea
          id="congratulations"
          value={congratulations}
          onChange={(e) => setCongratulations(e.target.value)}
          placeholder="Enter congratulations message"
        />
      </div>
    </div>
  )
}