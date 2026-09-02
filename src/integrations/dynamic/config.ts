export const dynamicEnvironmentId = (import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID as string | undefined)?.trim() ?? ''
export const isDynamicConfigured = Boolean(dynamicEnvironmentId)
