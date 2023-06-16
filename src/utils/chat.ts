const isProd = process.env.NODE_ENV === 'production'
const baseUrl = isProd ? 'https://baechat.fly.dev' : 'http://localhost:3000'

export const menifest = {
  schema_version: 'v1',
  name_for_model: 'baechat',
  name_for_human: 'BaeChat',
  description_for_model:
    'Plugin for searching and recommending restaurants near the user, with the BaeMin. Use it whenever the user wants to find restaurants based on their location information. It can be asked with Korean.',
  description_for_human: 'Search restaurants in BaeMin with ChatGPT.',
  auth: {
    type: 'none',
  },
  api: {
    type: 'openapi',
    url: `${baseUrl}/.well-known/openapi.yaml`,
    has_user_authentication: false,
  },
  logo_url: `${baseUrl}/.well-known/logo.png`,
  contact_email: 'hello@contact.com',
  legal_info_url: 'http://example.com/legal-info',
}
