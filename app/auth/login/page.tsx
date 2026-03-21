import { Metadata } from "next"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Iniciar sesión | KIREN",
  description: "Iniciá sesión en tu cuenta KIREN",
}

export default function LoginPage() {
  return <LoginForm />
}
