import { ChatMessage, MessageRole } from '../types';
import jsPDF from 'jspdf';

export const downloadFile = (filename: string, content: string | Blob, mimeType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatMarkdown = (messages: ChatMessage[], title: string, includeThinking: boolean): string => {
  const now = new Date().toLocaleString();
  let md = `# ${title}\n\n*Exported via AI Studio Obsidian*\n*Date: ${now}*\n\n---\n\n`;

  messages.forEach(msg => {
    const roleTitle = msg.role === MessageRole.USER ? '**User**' : '**Model**';
    md += `### ${roleTitle}\n\n`;

    if (includeThinking && msg.thinking) {
      md += `> **Thinking Process**\n>\n`;
      const thinkingLines = msg.thinking.split('\n').map(line => `> ${line}`).join('\n');
      md += `${thinkingLines}\n\n`;
    }

    md += `${msg.content}\n\n---\n\n`;
  });

  return md;
};

export const formatTxt = (messages: ChatMessage[], title: string, includeThinking: boolean): string => {
  const now = new Date().toLocaleString();
  let txt = `CHAT LOG: ${title}\nDate: ${now}\n========================================\n\n`;

  messages.forEach(msg => {
    const roleTitle = msg.role === MessageRole.USER ? 'USER' : 'MODEL';
    txt += `[${roleTitle}] (${msg.timestamp})\n`;

    if (includeThinking && msg.thinking) {
      txt += `\n--- START THINKING ---\n${msg.thinking}\n--- END THINKING ---\n\n`;
    }

    txt += `${msg.content}\n\n----------------------------------------\n\n`;
  });

  return txt;
};

export const generatePdf = (messages: ChatMessage[], title: string, includeThinking: boolean) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const headerTitle = title.length > 45 ? `${title.substring(0, 45)}...` : title;
  doc.text(headerTitle, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  messages.forEach(msg => {
    const isUser = msg.role === MessageRole.USER;

    // Role Label
    checkPageBreak(15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isUser ? 0 : 41, 128, 185);
    doc.text(isUser ? 'USER' : 'MODEL', margin, y);
    y += 6;

    // Thinking Block
    if (includeThinking && msg.thinking) {
      doc.setFont('courier', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100);

      const thinkingPrefix = '[Thinking Process]: ';
      const thinkingText = thinkingPrefix + msg.thinking.replace(/\n/g, ' ');
      const thinkingLines = doc.splitTextToSize(thinkingText, maxLineWidth - 10);

      checkPageBreak(thinkingLines.length * 4 + 5);

      doc.setDrawColor(230);
      doc.setLineWidth(1);
      doc.line(margin + 2, y, margin + 2, y + thinkingLines.length * 4);

      thinkingLines.forEach((line: string) => {
        doc.text(line, margin + 6, y);
        y += 4;
      });
      y += 4;
    }

    // Main Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0);

    const cleanContent = msg.content
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .replace(/`/g, '');

    const lines = doc.splitTextToSize(cleanContent, maxLineWidth);

    checkPageBreak(lines.length * 5 + 10);

    lines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 5;
    });

    y += 10;
  });

  const safeName = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30) || 'chat_export';
  doc.save(`${safeName}.pdf`);
};
