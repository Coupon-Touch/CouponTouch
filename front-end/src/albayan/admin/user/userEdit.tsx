import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Trash2, Key } from 'lucide-react'
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { GET_ALL_ADMIN_USERS, UPDATE_ADMIN_USER, DELETE_ADMIN_USER } from "@/graphQL/apiRequests"
import { useMutation, useQuery } from '@apollo/client'
import { UserRole } from './userCreation'
import { useToast } from '@/hooks/use-toast'

type User = {
  _id: string
  username: string
  userRole: string
}
type GET_ALL_ADMIN_USERS_INTERFACE = {
  getAllAdminUsers: {
    adminUsers?: User[]
  }
}


export default function Component() {
  const { data } = useQuery<GET_ALL_ADMIN_USERS_INTERFACE>(GET_ALL_ADMIN_USERS)

  const [updateUser, { loading: updateUserLoading }] = useMutation<{ updateAdminUser: { isSuccessful: boolean; message: string } }>(UPDATE_ADMIN_USER)
  const [deleteUserMutation] = useMutation<{ deleteAdminUser: { isSuccessful: boolean; message: string } }>(DELETE_ADMIN_USER)


  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (data && data.getAllAdminUsers.adminUsers) {
      setUsers(data.getAllAdminUsers.adminUsers.map((user: User) => {
        return {
          _id: user._id,
          username: user.username,
          userRole: user.userRole.replaceAll(" ", "").toUpperCase()
        }
      }))
    }
  }, [data])

  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null)
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('')
  const { toast } = useToast()

  const handleUpdateUser = (_id: string, userRole?: string, password?: string) => {
    return new Promise<boolean>((resolve) => {

      const params: { id: string; password?: string; userRole?: string } = {
        id: _id,
      }
      if (password) {
        params.password = password
      }
      if (userRole) {
        params.userRole = userRole
      }
      updateUser({
        variables: params
      }).then((response) => {
        if (response.data?.updateAdminUser.isSuccessful) {
          toast({
            title: response.data?.updateAdminUser.message,
            variant: 'success',
            duration: 5000
          })
          resolve(true)

        } else {
          toast({
            title: response.data?.updateAdminUser.message,
            variant: 'destructive',
            duration: 5000
          })
          resolve(false)
        }
      }).catch(() => {
        toast({
          title: "Something went wrong",
          variant: 'destructive',
          duration: 5000
        })
        resolve(false)
      })
    })

  }


  const deleteUser = (id: string) => {
    deleteUserMutation({ variables: { id: id } }).then((response) => {
      if (response.data?.deleteAdminUser.isSuccessful) {
        toast({
          title: response.data?.deleteAdminUser.message,
          variant: 'success',
          duration: 5000
        })
        setUsers(users.filter(user => user._id !== id))
      } else {
        toast({
          title: response.data?.deleteAdminUser.message,
          variant: 'destructive',
          duration: 5000
        })
      }
    }).catch(() => {
      toast({
        title: "Something went wrong",
        variant: 'destructive',
        duration: 5000
      })
    })
    setDeleteConfirmUser(null)
    setDeleteConfirmUsername('')
  }

  const changeRole = async (id: string, newRole: string) => {
    const user = users.find(user => user._id === id) as User
    if (user.userRole === newRole) return
    if (await handleUpdateUser(id, newRole)) {

      setUsers(users.map(user => user._id === id ? { ...user, userRole: newRole } : user))
    }
  }

  const changePassword = async () => {
    // In a real application, you would send this to your backend

    await handleUpdateUser(editingUser!._id, undefined, newPassword)
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
            <TableRow key={user._id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Select value={user.userRole} onValueChange={(value) => changeRole(user._id, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(UserRole).map((role) => {
                      return <SelectItem key={role} value={role}>{UserRole[role as keyof typeof UserRole]}</SelectItem>
                    })}

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
                        }} disabled={updateUserLoading}>Change Password</Button>
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
                          onClick={() => deleteUser(deleteConfirmUser!._id)}
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