import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderFilter'
})
export class OrderFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, status: string): any[] {
    if (!items) return [];

    return items.filter(item => {
      const matchesName = !searchText || item.user?.username?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesName && matchesStatus;
    });
  }
}
