import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  unit: string;

  @Column({ type: 'datetime', nullable: true })
  expiryDate: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bridgeLocation: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string | null; // Emoji or icon name

  @Column({ type: 'boolean', default: false })
  adminOnly: boolean; // Only ADMIN can add/edit this

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
