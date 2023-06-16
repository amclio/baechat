import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import Fastify from 'fastify'
import * as path from 'path'
import { fileURLToPath } from 'url'

import routes from './routes/index.js'

const isDev = process.env.NODE_ENV === 'development'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>()

await fastify.register(cors)
await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      description:
        'A BaeChat API for querying restaurants based on natural language queries and metadata',
      title: 'BaeChat Plugin API',
      version: '0.0.1',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
})

await fastify.register(routes)

if (isDev) {
  // NOTE: For serving static files in dev
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, './statics/.well-known'),
    serve: isDev,
  })

  fastify.route({
    handler: (req, reply) => {
      reply.sendFile('ai-plugin.json')
    },
    method: 'GET',
    schema: { hide: true },
    url: '/.well-known/ai-plugin.json',
  })
}

fastify
  .listen({ port: 3000 })
  .then(() => console.log('Server is listening on the port 3000!'))
