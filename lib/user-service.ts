import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class UserService {
  // Inscription
  static async register(userData: {
    email: string
    password: string
    name: string
    phone?: string
    operator?: string
  }) {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé')
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    })
    
    // Créer catégories par défaut
    await this.createDefaultCategories(user.id)
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    return { user, token }
  }
  
  // Connexion
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Email ou mot de passe incorrect')
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    return { user, token }
  }
  
  // Obtenir l'utilisateur actuel
  static async getCurrentUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        operator: true,
        createdAt: true
      }
    })
  }
  
  // Catégories par défaut
  static async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { name: 'Alimentation', icon: 'shopping-bag', color: '#D97706', backgroundColor: '#FEF3E2' },
      { name: 'Transport', icon: 'car', color: '#0A7B5E', backgroundColor: '#E8F5F1' },
      { name: 'Santé', icon: 'heart', color: '#16A34A', backgroundColor: '#F0FDF4' },
      { name: 'Shopping', icon: 'shopping-cart', color: '#DB2777', backgroundColor: '#FDF2F8' },
      { name: 'Logement', icon: 'home', color: '#2563EB', backgroundColor: '#EFF6FF' },
      { name: 'Télécom', icon: 'smartphone', color: '#0369A1', backgroundColor: '#F0F9FF' },
      { name: 'Éducation', icon: 'book', color: '#CA8A04', backgroundColor: '#FEFCE8' },
      { name: 'Autre', icon: 'package', color: '#6B7280', backgroundColor: '#F5F7F5' }
    ]
    
    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId,
        isDefault: true
      }))
    })
  }
}
