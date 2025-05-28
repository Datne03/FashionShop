import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk',
  standalone: false, pure: true
})
export class ChunkPipe implements PipeTransform {

  transform(value: any[], size: number): any[] {
    const result = [];
    for (let i = 0; i < value.length; i += size) {
      result.push(value.slice(i, i + size));  // Cắt mảng thành các nhóm nhỏ
    }
    return result;
  }
}
