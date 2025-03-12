import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AddressesModule } from './addresses/addresses.module';
import { AdminModule } from './admin/admin.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CartModule,
    CategoriesModule,
    AddressesModule,
    OrdersModule,
    ProductsModule,
    AdminModule,
    CheckoutModule,
  ],
})
export class AppModule {}
