import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddReferencesOnOrderProducts1641824874806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "order_products",
      new TableForeignKey({
        name: "OrdersFK",
        columnNames: ["orderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "orders",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "order_products",
      new TableForeignKey({
        name: "ProductsFK",
        columnNames: ["productId"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("order_products", "OrdersFK");
    await queryRunner.dropForeignKey("order_products", "ProductsFK");
  }
}
