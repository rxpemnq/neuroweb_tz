import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { Users } from '../models/users/entity/users.entity'

dotenv.config()

export const postgreSqlDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'postgres',
  entities: [Users],
  synchronize: true,
  dropSchema: true,
  logging: true
})
