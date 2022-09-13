import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function tryStuff () {
  const movies = await prisma.movie.findMany({ include: { categories: true } })
  console.log(movies)
}

tryStuff()
