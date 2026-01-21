import * as swaggerJSDoc from 'swagger-jsdoc'

const swagger = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cars and users app API',
      version: '0.0.1',
      description: 'api docs for my service'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/adapters/api/index.ts']
})

export default swagger
