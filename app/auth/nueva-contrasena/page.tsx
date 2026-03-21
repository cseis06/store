import { Metadata } from "next"
import NewPasswordForm from "./NewPasswordForm"

export const metadata: Metadata = {
  title: "Nueva contraseña | KIREN",
  description: "Establecé tu nueva contraseña",
}

export default function NewPasswordPage() {
  return <NewPasswordForm />
}
