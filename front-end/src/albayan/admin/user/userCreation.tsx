import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import * as yup from 'yup'
import { CREATE_ADMIN_USER } from '@/graphQL/apiRequests'
import { useMutation } from '@apollo/client'
import { useToast } from '@/hooks/use-toast'

export const UserRole = {
  ADMINUSER: 'Admin User',
  DISTRIBUTOR: 'Distributor',
} as const;

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  userRole: yup.string().required('Role is required')
})


export default function UserCreation() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userRole, setUserRole] = useState<keyof typeof UserRole>('DISTRIBUTOR')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [createAdminUser] = useMutation(CREATE_ADMIN_USER)
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}) // Clear previous errors
    schema.validate({ username, password, userRole }, { abortEarly: false })
      .then((validatedData) => {

        createAdminUser({ variables: validatedData })
          .then(response => {
            const data = response.data?.createAdminUser
            if (data?.isSuccessful) {
              toast({
                title: data.message,
                variant: 'success',
                duration: 5000
              })
              setUsername('')
              setPassword('')
              setUserRole('DISTRIBUTOR')
            } else {
              toast({
                title: data.message,
                variant: 'destructive',
                duration: 5000
              })
            }

          })
          .catch(error => {
            console.error('Error creating user:', error)
            // Optionally, handle error (e.g., show error message)
          })
      })
      .catch((err) => {
        const fieldErrors: { [key: string]: string } = {}
        err.inner.forEach((error: yup.ValidationError) => {
          if (error.path) {
            fieldErrors[error.path] = error.message
          }
        })
        setErrors(fieldErrors)
      })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">User Registration</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as typeof userRole)} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(UserRole).map((role) => {
                  return <SelectItem key={role} value={role}>{UserRole[role as keyof typeof UserRole]}</SelectItem>
                })}

              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500">{errors.role}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Register</Button>
        </CardFooter>
      </form>
    </Card>
  )
}