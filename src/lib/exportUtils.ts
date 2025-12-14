import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const exportToPDF = ({ title, filename, columns, data }: PDFExportOptions) => {
  const doc = new jsPDF();
  
  // Institutional Header
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(10, 47, 37); // Green dark (#0a2f25)
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Ministry text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('MINISTÉRIO DA EDUCAÇÃO', pageWidth / 2, 10, { align: 'center' });
  doc.text('SECRETARIA DE EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA', pageWidth / 2, 14, { align: 'center' });
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO TOCANTINS', pageWidth / 2, 18, { align: 'center' });
  doc.text('CAMPUS FORMOSO DO ARAGUAIA', pageWidth / 2, 22, { align: 'center' });
  
  // Project title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETO DE EXTENSÃO AWIRE DIGITAL', pageWidth / 2, 32, { align: 'center' });
  
  // Report title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 55, { align: 'center' });
  
  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Data de Geração: ${currentDate}`, pageWidth / 2, 62, { align: 'center' });
  
  // Table
  const tableData = data.map(item => columns.map(col => item[col.key] ?? '-'));
  
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: tableData,
    startY: 70,
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

export const exportArtesanatosPDF = (artesanatos: any[]) => {
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
  
  exportToPDF({
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
    { key: 'dataCriacao', label: 'Data de Registro' },
  ];
  
  const formattedData = artesaos.map(item => ({
    ...item,
    status: item.ativo !== false ? 'Ativo' : 'Inativo',
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  exportToCSV(formattedData, 'artesaos_awire', columns);
};

export const exportArtesaosPDF = (artesaos: any[]) => {
  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'aldeia', label: 'Aldeia' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'status', label: 'Status' },
    { key: 'dataCriacao', label: 'Data' },
  ];
  
  const formattedData = artesaos.map(item => ({
    ...item,
    status: item.ativo !== false ? 'Ativo' : 'Inativo',
    dataCriacao: item.createdAt?.toDate?.()
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : '-'
  }));
  
  exportToPDF({
    title: 'RELATÓRIO DE ARTESÃOS CADASTRADOS',
    filename: 'artesaos_awire',
    columns,
    data: formattedData,
  });
};
