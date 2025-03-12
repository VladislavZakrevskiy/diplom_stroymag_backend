import { Module } from '@nestjs/common';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminOrdersController } from './controllers/admin-orders.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminProductsService } from './services/admin-products.service';
import { AdminCategoriesService } from './services/admin-categories.service';
import { AdminUsersService } from './services/admin-users.service';
import { AdminOrdersService } from './services/admin-orders.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminProductsController,
    AdminCategoriesController,
    AdminUsersController,
    AdminOrdersController,
    AdminDashboardController,
  ],
  providers: [
    AdminProductsService,
    AdminCategoriesService,
    AdminUsersService,
    AdminOrdersService,
    AdminDashboardService,
  ],
})
export class AdminModule {}
