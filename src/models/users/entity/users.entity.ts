// eslint-disable-next-line prettier/prettier
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Tokens } from '../../tokens/entity/tokens.entity'

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

  @OneToOne(() => Tokens, (tokens) => tokens.user, {
    cascade: true
  })
  tokens: Tokens

  @CreateDateColumn({ type: 'timestamp' })
  dateCreate: Date
}
