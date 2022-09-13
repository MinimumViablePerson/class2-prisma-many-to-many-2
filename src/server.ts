import express, { response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

const port = 5678

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany({ include: { categories: true } })
  res.send(movies)
})

app.post('/movies', async (req, res) => {
  const movieData = {
    title: req.body.title,
    image: req.body.image,
    categories: req.body.categories ? req.body.categories : []
  }

  const movie = await prisma.movie.create({
    data: {
      title: movieData.title,
      image: movieData.image,
      categories: {
        // @ts-ignore
        connectOrCreate: movieData.categories.map(category => ({
          where: { name: category },
          create: { name: category }
        }))
      }
    },
    include: { categories: true }
  })
  res.send(movie)
})

app.delete('/movies/:id', async (req, res) => {
  await prisma.movie.delete({ where: { id: Number(req.params.id) } })
  res.send({ message: 'Film deleted successfully' })
})

app.patch('/addCategoryToMovie', async (req, res) => {
  const movieName = req.body.movieName
  const categoryName = req.body.categoryName

  const movie = await prisma.movie.update({
    where: { title: movieName },
    data: {
      categories: {
        connectOrCreate: {
          where: { name: categoryName },
          create: { name: categoryName }
        }
      }
    },
    include: {
      categories: true
    }
  })

  res.send(movie)
})

app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { movies: true }
  })
  res.send(categories)
})

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`)
})
