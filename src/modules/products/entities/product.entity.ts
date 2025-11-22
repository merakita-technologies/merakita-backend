// import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { BaseEntity } from '../../../shared/entities/base.entity';
// @Entity('products')
// export class Product extends BaseEntity {
//   @Column()
//   name: string;

//   @Column('text')
//   description: string;

//   @Column('decimal')
//   price: number;

//   @ManyToOne(() => User, user => user.products)
//   user: User;

//   @ManyToOne(() => Category, category => category.products)
//   category: Category;
// }