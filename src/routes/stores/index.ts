import type { FastifyInstance, RouteHandler } from 'fastify'

import { Client as GoogleMapClient } from '@googlemaps/google-maps-services-js'
import { Type } from '@sinclair/typebox'
import got from 'got'

interface LocationParam {
  lat: number
  lng: number
}

const mapClient = new GoogleMapClient({})

const createBaeUrl = ({ lat, lng }: LocationParam) =>
  `https://shopdp-api.baemin.com/v2/BAEMIN_ONE_HOME/curations?adid=00000000-0000-0000-0000-000000000000&appver=11.45.1&displayCategory=BAEMIN_ONE_HOME_ALL&latitude=${lat}&longitude=${lng}`

async function getResponseFromBae({ lat, lng }: LocationParam) {
  const url = createBaeUrl({ lat, lng })
  const response = (await got.get(url).json()) as any
  const shops: object[] = response.data.shops.map((shop: any) => ({
    address: shop.shopInfo.address,
    score: shop.shopStatistics.averageStarScore,
    shopName: shop.shopInfo.shopName,
    tel: shop.shopInfo.telNumber,
  }))

  return shops
}

async function getLocation(address: string) {
  const shops = await mapClient.geocode({
    params: {
      address,
      key: process.env.GOOGLE_MAP_API_KEY as string,
    },
  })

  return shops.data.results[0].geometry.location
}

const handler: RouteHandler = async (req, reply) => {
  const address = (req.query as any).address
  const location = await getLocation(address)
  const shops = await getResponseFromBae(location)

  await reply.send({ shops })
}

async function storeRoutes(fastify: FastifyInstance) {
  fastify.route({
    handler,
    method: 'GET',
    schema: {
      operationId: 'getStores',
      summary: 'Get the list of restaurants',
      response: {
        200: {
          type: 'object',
          properties: {
            shops: {
              type: 'array',
              items: {
                address: {
                  type: 'string',
                  description: 'The address where the user is located.',
                },
                score: {
                  type: 'number',
                  description: 'The score for the restaurant.',
                },
                shopName: {
                  type: 'string',
                  description: 'The name of the restaurant.',
                },
                tel: {
                  type: 'string',
                  description: 'The TEL number of the restaurant.',
                },
              },
            },
          },
        },
      },
      querystring: Type.Object({ address: Type.Required(Type.String()) }),
    },
    url: '/',
  })
}

export { storeRoutes }
