import type { FastifyInstance } from 'fastify'

import { storeRoutes } from './stores/index.js'

async function routes(fastify: FastifyInstance) {
  await fastify.register(storeRoutes, { prefix: '/stores' })
}

export default routes
