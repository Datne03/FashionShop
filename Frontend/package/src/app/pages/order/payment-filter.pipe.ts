import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentFilter'
})
export class PaymentFilterPipe implements PipeTransform {
  transform(items: any[], searchText3: string, searchPaymentStatus: string): any[] {
    if (!items) return [];

    return items.filter(item => {
      const matchesName = !searchText3 || item.user?.username?.toLowerCase().includes(searchText3.toLowerCase());
      const matchesStatus = !searchPaymentStatus || item.paymentMethod === searchPaymentStatus;
      return matchesName && matchesStatus;
    });
  }
}
