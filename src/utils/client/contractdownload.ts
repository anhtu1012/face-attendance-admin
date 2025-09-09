import { UserContractItem } from '@/dtos/quan-li-nguoi-dung/contracts/contract.dto';
import dayjs from 'dayjs';

interface ContractData {
  contractTitle: string;
  contractCode: string;
  employeeName: string;
  position: string;
  department: string;
  joinDate: string;
  contractEndTime?: string;
  baseSalary?: number;
  managedBy?: string;
  contractDuration?: string;
  contractDescription?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  status?: string;
}

const generateContractHTML = (data: ContractData): string => {
  const currentDate = new Date().toLocaleDateString('vi-VN');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hợp đồng lao động</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11px;
          line-height: 1.3;
          margin: 15px;
          color: #000;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
        }
        .company-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .company-info {
          font-size: 9px;
          margin-bottom: 2px;
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 20px 0 15px 0;
          text-align: center;
          border: 2px solid #000;
          padding: 10px;
          background: #f9f9f9;
        }
        .contract-code {
          font-size: 11px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }
        .section {
          margin: 15px 0;
          padding: 10px;
          background: #fafafa;
          border-radius: 5px;
        }
        .section-title {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 10px;
          text-transform: uppercase;
          color: #333;
          background: #e8e8e8;
          padding: 5px 8px;
          border-radius: 3px;
        }
        .info-grid {
          display: table;
          width: 100%;
          margin-bottom: 5px;
        }
        .info-row {
          display: table-row;
        }
        .info-label {
          display: table-cell;
          width: 110px;
          font-weight: bold;
          padding: 3px 8px 3px 0;
          vertical-align: top;
          font-size: 10px;
        }
        .info-value {
          display: table-cell;
          padding: 3px 0;
          vertical-align: top;
          font-size: 10px;
        }
        .two-column {
          display: table;
          width: 100%;
          margin-bottom: 10px;
        }
        .column {
          display: table-cell;
          width: 50%;
          padding-right: 15px;
          vertical-align: top;
        }
        .terms-section {
          display: table;
          width: 100%;
          margin: 10px 0;
        }
        .terms-column {
          display: table-cell;
          width: 33.33%;
          padding-right: 10px;
          vertical-align: top;
        }
        .signature-section {
          display: table;
          width: 100%;
          margin-top: 25px;
          page-break-inside: avoid;
        }
        .signature-block {
          display: table-cell;
          text-align: center;
          width: 50%;
          vertical-align: top;
        }
        .signature-title {
          font-weight: bold;
          margin-bottom: 35px;
          font-size: 10px;
          text-transform: uppercase;
        }
        .signature-name {
          padding-top: 5px;
          font-weight: bold;
          margin-top: 35px;
          font-size: 10px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 8px;
          color: #666;
          padding-top: 10px;
        }
        .status-badge {
          font-weight: bold;
          margin-left: 10px;
          padding: 2px 6px;
          background: #f0f0f0;
          border-radius: 3px;
          font-size: 9px;
        }
        .description-box {
          background: white;
          padding: 8px;
          margin-top: 5px;
          font-size: 10px;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .commitment-box {
          background: white;
          padding: 8px;
          margin: 5px 0;
          font-size: 9px;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .compact-section {
          margin: 10px 0;
          padding: 8px;
          background: #fafafa;
          border-radius: 5px;
        }
        .inline-info {
          display: inline-block;
          margin: 0 15px 5px 0;
          font-size: 10px;
        }
        .inline-label {
          font-weight: bold;
          margin-right: 5px;
        }
        .salary-highlight {
          background: #f5f5f5;
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">${data.companyName || 'CÔNG TY TNHH WDP'}</div>
        <div class="company-info">Địa chỉ: ${data.companyAddress || '123 Đường XYZ, Quận 1, TP.HCM'}</div>
        <div class="company-info">Điện thoại: ${data.companyPhone || '(028) 1234 5678'} | Email: ${data.companyEmail || 'info@wdp.com'}</div>
      </div>

      <div class="title">${data.contractTitle}</div>
      <div class="contract-code">
        Số hợp đồng: ${data.contractCode}
        <span class="status-badge">${data.status === 'ACTIVE' ? 'HIỆU LỰC' : 'HẾT HẠN'}</span>
      </div>

      <div class="two-column">
        <div class="column">
          <div class="section-title">Bên A - Bên thuê lao động:</div>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Công ty:</div>
              <div class="info-value">${data.companyName || 'Công ty TNHH WDP'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Đại diện:</div>
              <div class="info-value">${data.managedBy || 'Giám đốc'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Điện thoại:</div>
              <div class="info-value">${data.companyPhone || '(028) 1234 5678'}</div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="section-title">Bên B - Bên lao động:</div>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Họ tên:</div>
              <div class="info-value">${data.employeeName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Chức vụ:</div>
              <div class="info-value">${data.position}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Nơi làm việc:</div>
              <div class="info-value">${data.department}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="compact-section">
        <div class="section-title">Điều khoản hợp đồng:</div>
        <div class="terms-section">
          <div class="terms-column">
            <div class="inline-info">
              <span class="inline-label">Ngày bắt đầu:</span>${data.joinDate}
            </div>
            <div class="inline-info">
              <span class="inline-label">Thời hạn:</span>${data.contractDuration || 'Không xác định'}
            </div>
          </div>
          <div class="terms-column">
            ${data.contractEndTime ? `
            <div class="inline-info">
              <span class="inline-label">Ngày kết thúc:</span>${data.contractEndTime}
            </div>
            ` : ''}
            <div class="inline-info">
              <span class="inline-label">Trạng thái:</span>${data.status === 'ACTIVE' ? 'Hiệu lực' : 'Hết hạn'}
            </div>
          </div>
          <div class="terms-column">
            ${data.baseSalary ? `
            <div class="inline-info">
              <span class="inline-label">Lương CB:</span>
              <span class="salary-highlight">${data.baseSalary.toLocaleString('vi-VN')} VND</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      ${data.contractDescription ? `
      <div class="compact-section">
        <div class="section-title">Mô tả công việc:</div>
        <div class="description-box">${data.contractDescription}</div>
      </div>
      ` : ''}

      <div class="compact-section">
        <div class="section-title">Cam kết thực hiện:</div>
        <div class="commitment-box">
          <strong>Bên A cam kết:</strong> Tạo điều kiện làm việc tốt nhất, trả lương đúng hạn và đảm bảo quyền lợi cho người lao động.
          <br><strong>Bên B cam kết:</strong> Thực hiện đúng nhiệm vụ được giao, tuân thủ nội quy và quy định của công ty.
          <br><strong>Hai bên cam kết:</strong> Thực hiện đúng các điều khoản đã ký kết trong hợp đồng này.
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-title">Đại diện Bên A</div>
          <div class="signature-name">${data.managedBy || 'Giám đốc'}</div>
        </div>
        <div class="signature-block">
          <div class="signature-title">Bên B</div>
          <div class="signature-name">${data.employeeName}</div>
        </div>
      </div>

      <div class="footer">
        <strong>Hợp đồng lập thành 02 bản, mỗi bên giữ 01 bản.</strong><br>
        Ngày xuất: ${currentDate} | Hệ thống WDP
      </div>
    </body>
    </html>
  `;
};

const downloadHTMLAsPDF = (htmlContent: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker.');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

export const downloadContract = async (contractData: UserContractItem, userFullName?: string): Promise<void> => {
  try {
    console.log('Đang tạo file PDF...');

    // Format dates
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A";
      return dayjs(dateString).format('DD/MM/YYYY');
    };

    const finalContractData: ContractData = {
      contractTitle: contractData.title || "HỢP ĐỒNG LAO ĐỘNG",
      contractCode: contractData.code || "N/A",
      employeeName: contractData.fullName || userFullName || "N/A",
      position: "N/A",
      department: contractData.branchNames || "N/A",
      joinDate: formatDate(contractData.startTime),
      contractEndTime: contractData.endTime ? formatDate(contractData.endTime) : undefined,
      baseSalary: contractData.baseSalary,
      managedBy: contractData.fullNameManager || "N/A",
      contractDuration: contractData.duration || "N/A",
      contractDescription: contractData.description || "Thực hiện các nhiệm vụ được giao theo đúng chức vụ và quy định của công ty.",
      companyName: "CÔNG TY TNHH WDP",
      companyAddress: "123 Đường XYZ, Quận 1, TP.HCM",
      companyPhone: "(028) 1234 5678",
      companyEmail: "info@wdp.com",
      status: contractData.status
    };

    // Generate HTML content
    const htmlContent = generateContractHTML(finalContractData);
    
    // Create filename with contract code and timestamp
    // const timestamp = dayjs().format('YYYY-MM-DD');
    // const fileName = `HopDong_${finalContractData.contractCode}_${timestamp}.pdf`;

    // Use browser's print functionality to save as PDF
    downloadHTMLAsPDF(htmlContent);
    
    console.log('Hợp đồng đã được tạo. Vui lòng chọn "Lưu dưới dạng PDF" trong hộp thoại in.');

  } catch (error) {
    console.error('Error downloading contract:', error);
    throw new Error('Không thể tải hợp đồng. Vui lòng thử lại sau.');
  }
};
