import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import logos as base64 - we'll load them dynamically
import awireLogoPdf from '@/assets/awire-logo-pdf.png';
import iftoLogoPdf from '@/assets/ifto-logo-pdf.png';
import brasaoPdf from '@/assets/brasao-pdf.png';

// ===== CSV EXPORT =====

export const exportToCSV = (data: Record<string, any>[], filename: string, columns: { key: string; label: string }[]) => {
  // Build header row - use semicolon for Excel compatibility (European/Brazilian locale)
  const header = columns.map(col => col.label).join(';');
  
  // Build data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Escape semicolons and quotes in CSV
      if (typeof value === 'string' && (value.includes(';') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(';');
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

// ===== JSON BACKUP EXPORT =====

export const exportToJSON = (data: Record<string, any>, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
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
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Dark green header background (matching brand)
  doc.setFillColor(28, 103, 88); // Green medium (#1C6758)
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // White text on dark header
  doc.setTextColor(255, 255, 255);
  
  // Ministry text - centered on dark background
  doc.setFontSize(8);
  doc.text('MINISTÉRIO DA EDUCAÇÃO', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(7);
  doc.text('SECRETARIA DE EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA', pageWidth / 2, 18, { align: 'center' });
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO TOCANTINS', pageWidth / 2, 24, { align: 'center' });
  doc.text('CAMPUS FORMOSO DO ARAGUAIA', pageWidth / 2, 30, { align: 'center' });
  
  // Project title - bold and larger
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETO DE EXTENSÃO AWIRE DIGITAL', pageWidth / 2, 42, { align: 'center' });
  
  // Report title - below header with proper spacing
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 70, { align: 'center' });
  
  // Date - with clear spacing below title
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Data de Geração: ${currentDate}`, pageWidth / 2, 80, { align: 'center' });
  
  // Table - starts with proper margin from header
  const tableData = data.map(item => columns.map(col => item[col.key] ?? '-'));
  
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: tableData,
    startY: 90,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [28, 103, 88], // Green medium (#1C6758)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
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
