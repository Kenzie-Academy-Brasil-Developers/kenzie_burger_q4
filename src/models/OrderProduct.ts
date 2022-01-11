import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import Order from "./Order";
import Product from "./Product";

@Entity("order_products")
class OrderProduct {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => Order)
  order: Order;

  @Column()
  productId: string;

  @Column()
  orderId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrderProduct;
