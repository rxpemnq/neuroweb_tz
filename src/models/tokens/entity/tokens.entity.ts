// eslint-disable-next-line prettier/prettier
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Users } from '../../users/entity/users.entity'

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column({ type: 'int', default: 0 })
  balance: number

  @OneToOne(() => Users, (users) => users.tokens, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: Users

  @CreateDateColumn()
  dateUpdate: Date

  @CreateDateColumn()
  dateCreate: Date
}
