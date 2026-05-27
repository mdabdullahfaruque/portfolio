export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function initializeAdminCredentials() {
  const adminEmail = 'admin@abdullahfaruque.com'
  const adminPassword = 'Admin@123456'
  
  const hashedPassword = await hashPassword(adminPassword)
  
  return {
    email: adminEmail,
    passwordHash: hashedPassword
  }
}

export async function validateAdminLogin(email: string, password: string, storedHash: string): Promise<boolean> {
  if (email !== 'admin@abdullahfaruque.com') {
    return false
  }
  
  return await verifyPassword(password, storedHash)
}
