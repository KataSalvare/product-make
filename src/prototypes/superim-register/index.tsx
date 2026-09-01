import { DynamicAuthPage } from '../../integrations/dynamic/DynamicAuthPage'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'

export default function RegisterPage() {
  return <DynamicAuthPage title="Create your SuperIM account" description="Dynamic creates or restores your Embedded Wallet after authentication." />
}
