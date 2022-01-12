import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import OrderProduct from "./OrderProduct";
import { Expose } from "class-transformer";

@Entity("orders")
class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  desk: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  products: OrderProduct[];

  @Expose({ name: "subtotal" })
  getSubtotal(): number {
    const subtotal = this.products.reduce(
      (acc, actual) => acc + Number(actual.product.price),
      0
    );

    return subtotal;
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
