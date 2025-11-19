import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Project } from './Project';

export enum ClientType {
  ENTERPRISE = 'enterprise',
  PUBLIC_SECTOR = 'public_sector',
  STARTUP = 'startup',
  SME = 'sme',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  name!: string;

  @Column({
    type: 'text',
    enum: ClientType,
    nullable: true,
  })
  type?: ClientType;

  @Column({ nullable: true })
  sector?: string;

  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  @Index()
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'text',
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
  })
  @Index()
  status!: ClientStatus;

  // Relations
  @OneToMany(() => Project, (project) => project.client)
  projects?: Project[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
