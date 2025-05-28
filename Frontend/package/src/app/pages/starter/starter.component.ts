import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppSalesOverviewComponent } from 'src/app/components/sales-overview/sales-overview.component';
import { AppDailyActivitiesComponent } from 'src/app/components/daily-activities/daily-activities.component';
import { AppProductPerformanceComponent } from 'src/app/components/product-performance/product-performance.component';
import { AppBlogComponent } from 'src/app/components/apps-blog/apps-blog.component';
import { SimplePieComponent } from 'src/app/components/simple-pie/simple-pie.component';
import { OrderSttComponent } from "../../components/order-stt/order-stt.component";



@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppSalesOverviewComponent,
    AppDailyActivitiesComponent,
    AppProductPerformanceComponent,
    SimplePieComponent,
    AppBlogComponent,
    OrderSttComponent
],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }