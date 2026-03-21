import { Metadata } from "next"
import RegisterForm from "./RegisterForm"

export const metadata: Metadata = {
  title: "Crear cuenta | KIREN",
  description: "Creá tu cuenta KIREN y empezá a comprar",
}

export default function RegisterPage() {
  return <RegisterForm />
}
