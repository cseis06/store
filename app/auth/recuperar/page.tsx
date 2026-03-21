import { Metadata } from "next"
import RecoverForm from "./RecoverForm"

export const metadata: Metadata = {
  title: "Recuperar contraseña | KIREN",
  description: "Recuperá tu contraseña de KIREN",
}

export default function RecoverPage() {
  return <RecoverForm />
}
