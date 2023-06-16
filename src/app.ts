import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import * as path from 'path'
import { fileURLToPath } from 'url'

import routes from './routes/index.js'

const isDev = process.env.NODE_ENV === 'development'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fastify = Fastify()

fastify.register(routes)
fastify.register(cors)

if (isDev) {
  // NOTE: For serving static files in dev
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, './statics/.well-known'),
    serve: isDev,
  })

  fastify.get('/.well-known/ai-plugin.json', (req, reply) => {
    reply.sendFile('ai-plugin.json')
  })

  fastify.get('/.well-known/openapi.yaml', (req, reply) => {
    reply.sendFile('openapi.yaml')
  })
}

fastify
  .listen({ port: 3000 })
  .then(() => console.log('Server is listening on the port 3000!'))
