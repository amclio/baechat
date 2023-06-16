import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import Fastify from 'fastify'
import * as path from 'path'
import { fileURLToPath } from 'url'

import routes from './routes/index.js'
import { menifest } from './utils/chat.js'

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
    servers: [
      { url: 'http://localhost:3000' },
      { url: 'https://baechat.fly.dev' },
    ],
  },
})

await fastify.register(routes)

fastify.register(fastifyStatic, {
  root: path.join(__dirname, './statics/.well-known'),
})

fastify.route({
  handler: (req, reply) => {
    reply.send(menifest)
  },
  method: 'GET',
  schema: { hide: true },
  url: '/.well-known/ai-plugin.json',
})

fastify.route({
  handler: (req, reply) => {
    reply.send(fastify.swagger({ yaml: true }))
  },
  method: 'GET',
  schema: { hide: true },
  url: '/.well-known/openapi.yaml',
})

fastify
  .listen({ port: 3000, host: '0.0.0.0' })
  .then((host) => console.log('Server is listening: ', host))
