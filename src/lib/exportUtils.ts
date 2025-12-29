import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import logos as base64 - we'll load them dynamically
import awireLogoPdf from '@/assets/awire-logo-pdf.png';
import iftoLogoPdf from '@/assets/ifto-logo-pdf.png';
import brasaoPdf from '@/assets/brasao-pdf.png';

// ===== CSV EXPORT =====

export const exportToCSV = (data: Record<string, any>[], filename: string, columns: { key: string; label: string }[]) => {
  // Build header row
  const header = columns.map(col => col.label).join(',');
  
  // Build data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });
  
  const csvContent = [header, ...rows].join('\n');
  
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ===== PDF EXPORT =====

interface PDFExportOptions {
  title: string;
  filename: string;
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
}

// Helper function to load image as base64
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const exportToPDF = async ({ title, filename, columns, data }: PDFExportOptions) => {
  const doc = new jsPDF();
  
  // Institutional Header
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 297, 'F');
  
  // Header bar - light gray
  doc.setFillColor(248, 248, 248);
  doc.rect(0, 0, pageWidth, 75, 'F');
  
  try {
    // Load and add logos - bigger sizes
    const [awireLogo, iftoLogo, brasaoLogo] = await Promise.all([
      loadImageAsBase64(awireLogoPdf),
      loadImageAsBase64(iftoLogoPdf),
      loadImageAsBase64(brasaoPdf)
    ]);
    
    // Add logos - positioned horizontally with larger sizes
    const logoHeight = 22;
    const logoY = 8;
    
    // Awire logo (left)
    doc.addImage(awireLogo, 'PNG', 15, logoY, 25, logoHeight);
    
    // IFTO logo (center-left)
    doc.addImage(iftoLogo, 'PNG', 50, logoY, 20, logoHeight);
    
    // Brasão (right)
    doc.addImage(brasaoLogo, 'PNG', pageWidth - 38, logoY, 23, logoHeight);
  } catch (error) {
    console.error('Error loading logos for PDF:', error);
  }
  
  // Ministry text - positioned below logos with proper spacing
  const textStartY = 35;
  doc.setTextColor(139, 0, 0); // Dark red for ministry text
  doc.setFontSize(7);
  doc.text('MINISTÉRIO DA EDUCAÇÃO', pageWidth / 2, textStartY, { align: 'center' });
  doc.text('SECRETARIA DE EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA', pageWidth / 2, textStartY + 4, { align: 'center' });
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO TOCANTINS', pageWidth / 2, textStartY + 8, { align: 'center' });
  doc.text('CAMPUS FORMOSO DO ARAGUAIA', pageWidth / 2, textStartY + 12, { align: 'center' });
  
  // Project title - with more spacing
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETO DE EXTENSÃO AWIRE DIGITAL', pageWidth / 2, textStartY + 22, { align: 'center' });
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 68, pageWidth - 15, 68);
  
  // Report title - moved down with more spacing
  doc.setFontSize(12);
  doc.text(title, pageWidth / 2, 82, { align: 'center' });
  
  // Date - with proper spacing below title
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Data de Geração: ${currentDate}`, pageWidth / 2, 90, { align: 'center' });
  
  // Table - adjusted startY to accommodate header spacing
  const tableData = data.map(item => columns.map(col => item[col.key] ?? '-'));
  
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: tableData,
    startY: 100,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [28, 103, 88], // Green medium (#1C6758)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { left: 14, right: 14 },
  });
  
  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 AWIRE DIGITAL - Todos os direitos reservados',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }
  
  doc.save(`${filename}.pdf`);
};

// ===== ARTESANATO EXPORT HELPERS =====

export const exportArtesanatosCSV = (artesanatos: any[]) => {
  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'aldeia', label: 'Aldeia' },
    { key: 'artesaoNome', label: 'Artesão' },
    { key: 'dataCriacao', label: 'Data de Criação' },
  ];
  
  const formattedData = artesanatos.map(item => ({
    ...item,
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  exportToCSV(formattedData, 'artesanatos_awire', columns);
};

export const exportArtesanatosPDF = async (artesanatos: any[]) => {
  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'aldeia', label: 'Aldeia' },
    { key: 'artesaoNome', label: 'Artesão' },
    { key: 'dataCriacao', label: 'Data' },
  ];
  
  const formattedData = artesanatos.map(item => ({
    ...item,
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  await exportToPDF({
    title: 'RELATÓRIO DE ARTESANATOS CADASTRADOS',
    filename: 'artesanatos_awire',
    columns,
    data: formattedData,
  });
};

// ===== ARTESÃOS EXPORT HELPERS =====

export const exportArtesaosCSV = (artesaos: any[]) => {
  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'aldeia', label: 'Aldeia' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'status', label: 'Status' },
    { key: 'documentacao', label: 'Documentação' },
    { key: 'dataCriacao', label: 'Data de Registro' },
  ];
  
  const formattedData = artesaos.map(item => ({
    ...item,
    status: item.ativo !== false ? 'Ativo' : 'Inativo',
    documentacao: item.urlTermoAssinado ? 'OK' : 'Pendente',
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  exportToCSV(formattedData, 'artesaos_awire', columns);
};

export const exportArtesaosPDF = async (artesaos: any[]) => {
  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'aldeia', label: 'Aldeia' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'status', label: 'Status' },
    { key: 'documentacao', label: 'Doc.' },
    { key: 'dataCriacao', label: 'Data' },
  ];
  
  const formattedData = artesaos.map(item => ({
    ...item,
    status: item.ativo !== false ? 'Ativo' : 'Inativo',
    documentacao: item.urlTermoAssinado ? 'OK' : 'Pendente',
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  await exportToPDF({
    title: 'RELATÓRIO DE ARTESÃOS CADASTRADOS',
    filename: 'artesaos_awire',
    columns,
    data: formattedData,
  });
};
