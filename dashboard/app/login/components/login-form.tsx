"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from "@/graphql/accounts"
import { JWT_TOKEN_KEY, ROLE_KEY } from "@/constants/auth.constants"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import useAuth from "@/hooks/use-auth"
import Link from "next/link"
import { TextField } from "@/components/input"
import PasswordField from "@/components/input/password-field"


const formSchema = z.object({
  email: z.string().email().toLowerCase().min(5, {
    message: "Email must be valid",
  }),
  password: z.string().min(2, {
    message: "password must be at least 5 characters.",
  }),
})


function LoginForm() {
  const { toast } = useToast()
  const checkAuth = useAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const [userLogin, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: async (res) => {
      const { token, user, success = false, message } = res.loginUser;
      console.log(res.loginUser);
      
      if (!success) {
        toast({
          variant: 'destructive',
          description: message,
        })
        return
      };

      localStorage.setItem(JWT_TOKEN_KEY, token)
      localStorage.setItem(ROLE_KEY, user.role.name)

      toast({
        variant: 'default',
        description: message,
      })
      router.push('/dashboard')
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: 'destructive',
        description: err.message,
      })
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    userLogin({
      variables: {
        email: email,
        password: password
      }
    })
  }

  useEffect(() => {
    if (checkAuth?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [checkAuth?.isAuthenticated, router])



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <TextField
              form={form}
              name="email"
              label="Email"
              placeholder="Email"
            />
            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Password"
            />
            <Button disabled={loading} type="submit">Submit</Button>
          </form>
        </Form>

        <Button variant={'link'} className="w-full mt-5 flex items-end  justify-center ">
          <Link href='/forgot'>Lost your password?</Link>
        </Button>
      </CardContent>
    </Card>
  )
}


export default LoginForm