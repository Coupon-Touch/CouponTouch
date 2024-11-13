import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Trash2, Key } from 'lucide-react'
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type User = {
  id: number
  username: string
  role: string
}

export default function Component() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'john_doe', role: 'admin' },
    { id: 2, username: 'jane_smith', role: 'user' },
    { id: 3, username: 'bob_johnson', role: 'admin' },
  ])

  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null)
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('')

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id))
    setDeleteConfirmUser(null)
    setDeleteConfirmUsername('')
  }

  const changeRole = (id: number, newRole: string) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user))
  }

  const changePassword = () => {
    // In a real application, you would send this to your backend
    console.log(`Changing password for user ${editingUser?.username} to ${newPassword}`)
    setEditingUser(null)
    setNewPassword('')
    setIsEditingPassword(false)

  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Select defaultValue={user.role} onValueChange={(value) => changeRole(user.id, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog open={isEditingPassword} onOpenChange={setIsEditingPassword}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => {
                        setEditingUser(user);
                        setIsEditingPassword(true);
                      }}>
                        <Key className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password for {editingUser?.username}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="new-password" className="text-right">
                            New Password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          changePassword()
                        }}>Change Password</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" onClick={() => setDeleteConfirmUser(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Please type the username
                          <span className='select-none px-1'>
                            "{deleteConfirmUser?.username}"
                          </span>
                          to confirm.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">

                          <Input
                            id="confirm-username"
                            value={deleteConfirmUsername}
                            onChange={(e) => setDeleteConfirmUsername(e.target.value)}
                            className="col-span-4"
                          />
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                          setDeleteConfirmUser(null)
                          setDeleteConfirmUsername('')
                        }}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUser(deleteConfirmUser!.id)}
                          disabled={deleteConfirmUsername !== deleteConfirmUser?.username}
                        >
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}