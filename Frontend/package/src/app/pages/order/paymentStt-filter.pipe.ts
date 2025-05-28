import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentSttFilter'
})
export class PaymentSttFilterPipe implements PipeTransform {
  transform(items: any[], searchText2: string, searchMethod: string): any[] {
    if (!items) return [];

    return items.filter(item => {
      const matchesName = !searchText2 || item.user?.username?.toLowerCase().includes(searchText2.toLowerCase());
      const matchesStatus = !searchMethod || item.paymentStatus === searchMethod;
      return matchesName && matchesStatus;
    });
  }
}
