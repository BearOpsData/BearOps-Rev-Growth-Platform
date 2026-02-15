/**
 * Script to create an admin user in the database
 * Run with: npx tsx scripts/create-admin-user.ts
 * Or: npm run create-admin
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdminUser() {
  try {
    console.log('🔐 Create Admin User for BearOps\n')

    const email = await question('Email: ')
    if (!email) {
      console.error('❌ Email is required')
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists`)
      const overwrite = await question('Do you want to update the password? (y/n): ')
      if (overwrite?.toLowerCase() !== 'y') {
        console.log('Cancelled')
        process.exit(0)
      }
    }

    const password = await question('Password: ')
    if (!password || password.length < 8) {
      console.error('❌ Password must be at least 8 characters')
      process.exit(1)
    }

    const name = await question('Name (optional): ')

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name: name || null,
      },
      create: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    console.log(`\n✅ User created/updated successfully!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`\n📝 You can now log in at /login`)
  } catch (error) {
    console.error('❌ Error creating user:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdminUser()

