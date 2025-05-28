import { Component, OnInit } from '@angular/core';
import { InventoryResponse, InventoryService } from 'src/app/core/services/inventory.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-report-stock',
  templateUrl: './report-stock.component.html',
  styleUrls: ['./report-stock.component.scss'],
  standalone: false
})
export class ReportStockComponent implements OnInit {
  inventoryList: InventoryResponse[] = []; // toàn bộ data gốc
  filteredList: InventoryResponse[] = [];  // sau khi lọc
  paginatedList: InventoryResponse[] = []; // sau phân trang

  filterStatus: string = '';
  currentPage: number = 1;
  pageSize: number = 10; // số dòng mỗi trang
  totalPages: number = 0;
  pagesArray: number[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getInventoryReport().subscribe({
      next: (data) => {
        this.inventoryList = data;
        this.filteredList = [...this.inventoryList];
        this.updatePagination();
      },
      error: (err) => console.error('Lỗi khi lấy báo cáo tồn kho:', err)
    });
  }

  filterData() {
    if (this.filterStatus) {
      this.filteredList = this.inventoryList.filter(item => item.status === this.filterStatus);
    } else {
      this.filteredList = [...this.inventoryList];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedList = this.filteredList.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
  }

  exportToExcel(): void {
    const fileName = 'BaoCaoTonKho.xlsx';
    
    // Chuyển dữ liệu về dạng array of JSON
    const worksheet = XLSX.utils.json_to_sheet(this.filteredList.map((item, index) => ({
      'STT': index + 1,
      'Sản phẩm': item.productName,
      'Tồn đầu kỳ': item.beginningStock,
      'Nhập trong kỳ': item.receivedQuantity,
      'Bán ra': item.soldQuantity,
      'Tồn cuối kỳ': item.endingStock,
      'Trạng thái': item.status
    })));
  
    const workbook = { Sheets: { 'Báo cáo tồn kho': worksheet }, SheetNames: ['Báo cáo tồn kho'] };
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, fileName);
  }
  
}
