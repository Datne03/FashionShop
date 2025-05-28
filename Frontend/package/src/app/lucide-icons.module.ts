// src/app/shared/lucide-icons.module.ts
import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import {
  Bell,
  Heart,
  ShoppingCart,
  User,
  MessageSquare,
  Eye,
  Delete,
  Trash
} from 'lucide';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Bell,
      Heart,
      ShoppingCart,
      User,
      MessageSquare,
      Eye,
      Delete,
      Trash
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
