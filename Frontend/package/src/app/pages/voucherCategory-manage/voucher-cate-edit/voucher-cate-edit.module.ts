import { NgModule } from '@angular/core';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { VoucherCateEditComponent } from './voucher-cate-edit.component';


@NgModule({
  declarations: [VoucherCateEditComponent],
  imports: [
    FormsModule,
],
  providers: [ToolbarService, EditService, PageService]
})
export class VoucherCategoryManageModule { }
