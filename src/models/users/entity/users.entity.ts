// eslint-disable-next-line prettier/prettier
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  roleId: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ unique: true })
  phone: string

  @CreateDateColumn({ type: 'timestamp' })
  dateCreate: Date
}
