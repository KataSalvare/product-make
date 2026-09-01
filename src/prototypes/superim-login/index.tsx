import { DynamicAuthPage } from '../../integrations/dynamic/DynamicAuthPage'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'

export default function LoginPage() {
  return <DynamicAuthPage title="Sign in to SuperIM" description="Dynamic handles authentication and wallet access in one embedded flow." />
}
