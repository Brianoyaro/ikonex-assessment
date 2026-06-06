import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFFromElement = async (elementId, fileName = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateSimplePDF = (title, content, fileName = 'report.pdf') => {
  const pdf = new jsPDF();

  // Add title
  pdf.setFontSize(16);
  pdf.text(title, 10, 10);

  // Add content
  pdf.setFontSize(12);
  const lines = pdf.splitTextToSize(content, 190);
  pdf.text(lines, 10, 30);

  pdf.save(fileName);
};
