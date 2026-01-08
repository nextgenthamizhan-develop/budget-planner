import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportElementToPDF = async (element: HTMLElement, fileName: string) => {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let y = 0;
  let remaining = imgHeight;

  pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
  while (remaining > pageHeight) {
    remaining -= pageHeight;
    pdf.addPage();
    y = -(imgHeight - remaining);
    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
  }

  pdf.save(fileName);
};
