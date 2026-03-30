'use client';

// Dynamically imported to avoid SSR issues
export async function generateMonthlyPDF(data: {
  userName: string;
  month: number;
  year: number;
  totalRevenues: number;
  totalExpenses: number;
  incomes: { date: string; source: string; note?: string; amount: number }[];
  expenses: { date: string; category: string; description?: string; amount: number }[];
}) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ——— DESIGN TOKENS ———
  const PRIMARY = '#0A7B5E';     // MoneyFlow Green
  const SECONDARY = '#065F46';   // Darker Green
  const ACCENT = '#10B981';      // Vibrant Green
  const RED = '#E11D48';         // Professional Red
  const TEXT_DARK = '#111827';   // Gray 900
  const TEXT_GRAY = '#4B5563';   // Gray 600
  const TEXT_LIGHT = '#9CA3AF';  // Gray 400
  const BG_LIGHT = '#F9FAFB';    // Gray 50
  const WHITE = '#FFFFFF';
  
  const PAGE_W = 210;
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    } catch { return dateStr; }
  };

  const solde = data.totalRevenues - data.totalExpenses;
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(4, '0')}/${today.getFullYear()}`;

  // ——— 1. HEADER section ———
  // Background header bar
  doc.setFillColor(PRIMARY);
  doc.rect(0, 0, PAGE_W, 45, 'F');

  // Logo stylized
  doc.setTextColor(WHITE);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('MoneyFlow', MARGIN, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('rgba(255,255,255,0.8)');
  doc.text('VOTRE COMPAGNON FINANCIER', MARGIN, 28);

  // Report details (top right)
  doc.setFontSize(14);
  doc.setTextColor(WHITE);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT MENSUEL', PAGE_W - MARGIN, 22, { align: 'right' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const periodLabel = `${monthNamesFr[data.month - 1]} ${data.year}`;
  doc.text(periodLabel.toUpperCase(), PAGE_W - MARGIN, 29, { align: 'right' });

  // ——— 2. USER INFO CARD ———
  let cursorY = 55;
  doc.setFillColor(WHITE);
  doc.setDrawColor('#E5E7EB');
  doc.roundedRect(MARGIN, cursorY, CONTENT_W, 20, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(TEXT_GRAY);
  doc.text('ÉTABLI POUR', MARGIN + 6, cursorY + 7);
  
  doc.setFontSize(12);
  doc.setTextColor(TEXT_DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName.toUpperCase(), MARGIN + 6, cursorY + 14);

  doc.setFontSize(9);
  doc.setTextColor(TEXT_GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE DE GÉNÉRATION', PAGE_W - MARGIN - 6, cursorY + 7, { align: 'right' });
  doc.setTextColor(TEXT_DARK);
  doc.text(todayStr, PAGE_W - MARGIN - 6, cursorY + 14, { align: 'right' });

  // ——— 3. SUMMARY STATS ———
  cursorY += 28;
  const cardW = (CONTENT_W - 8) / 3;
  const cardH = 26;

  const stats = [
    { label: 'REVENUS TOTAUX', value: `+${fmt(data.totalRevenues)}`, color: PRIMARY, bg: '#F0FDF4' },
    { label: 'DÉPENSES TOTALES', value: `-${fmt(data.totalExpenses)}`, color: RED, bg: '#FEF2F2' },
    { label: 'SOLDE DU MOIS', value: fmt(solde), color: solde >= 0 ? PRIMARY : RED, bg: solde >= 0 ? '#ECFDF5' : '#FFF1F2' },
  ];

  stats.forEach((s, i) => {
    const x = MARGIN + i * (cardW + 4);
    doc.setFillColor(s.bg);
    doc.roundedRect(x, cursorY, cardW, cardH, 3, 3, 'F');

    // Accent line on top
    doc.setFillColor(s.color);
    doc.rect(x + 5, cursorY, cardW - 10, 1.5, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_GRAY);
    doc.text(s.label, x + cardW / 2, cursorY + 8, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(s.color);
    doc.text(s.value, x + cardW / 2, cursorY + 18, { align: 'center' });
  });

  cursorY += cardH + 12;

  // ——— 4. REVENUES TABLE ———
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY);
  doc.text('Détail des Revenus', MARGIN, cursorY);
  
  // Underline
  doc.setDrawColor(PRIMARY);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, cursorY + 2, MARGIN + 40, cursorY + 2);
  cursorY += 8;

  const incomeRows = data.incomes.length > 0
    ? data.incomes.map((inc) => [
        formatDate(inc.date || '-'),
        (inc.source || '-').toUpperCase(),
        inc.note || '—',
        `+${fmt(inc.amount)}`,
      ])
    : [['—', 'AUCUN REVENU', '—', '0 FCFA']];

  autoTable(doc, {
    startY: cursorY,
    head: [['Date', 'Source', 'Note', 'Montant']],
    body: incomeRows,
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9, cellPadding: 4, textColor: TEXT_DARK, lineColor: '#E5E7EB', lineWidth: 0.1 },
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', halign: 'center', fontSize: 10 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 28 },
      1: { fontStyle: 'bold', cellWidth: 40 },
      2: { textColor: TEXT_GRAY },
      3: { halign: 'right', cellWidth: 38, textColor: PRIMARY, fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: '#F9FAFB' },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page for expenses
  if (cursorY > 230) {
    doc.addPage();
    cursorY = 25;
  }

  // ——— 5. EXPENSES TABLE ———
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(RED);
  doc.text('Détail des Dépenses', MARGIN, cursorY);
  
  doc.setDrawColor(RED);
  doc.line(MARGIN, cursorY + 2, MARGIN + 45, cursorY + 2);
  cursorY += 8;

  const expenseRows = data.expenses.length > 0
    ? data.expenses.map((exp) => [
        formatDate(exp.date || '-'),
        (exp.category || '-').toUpperCase(),
        exp.description || '—',
        `-${fmt(exp.amount)}`,
      ])
    : [['—', 'AUCUNE DÉPENSE', '—', '0 FCFA']];

  autoTable(doc, {
    startY: cursorY,
    head: [['Date', 'Catégorie', 'Description', 'Montant']],
    body: expenseRows,
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9, cellPadding: 4, textColor: TEXT_DARK, lineColor: '#E5E7EB', lineWidth: 0.1 },
    headStyles: { fillColor: RED, textColor: WHITE, fontStyle: 'bold', halign: 'center', fontSize: 10 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 28 },
      1: { fontStyle: 'bold', cellWidth: 40 },
      2: { textColor: TEXT_GRAY },
      3: { halign: 'right', cellWidth: 38, textColor: RED, fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: '#FFF9F9' },
  });

  // ——— 6. VERIFIED SEAL & TOTALS ———
  cursorY = (doc as any).lastAutoTable.finalY + 15;
  if (cursorY > 260) {
    doc.addPage();
    cursorY = 25;
  }

  // "Verified by MoneyFlow" Badge
  doc.setFillColor('#F3F4F6');
  doc.roundedRect(MARGIN, cursorY, 50, 15, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_GRAY);
  doc.text('GÉNÉRÉ PAR', MARGIN + 25, cursorY + 6, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY);
  doc.text('MONEYFLOW SECURE', MARGIN + 25, cursorY + 11, { align: 'center' });

  // Final Summary on the right
  doc.setTextColor(TEXT_GRAY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('TOTAL DES FLUX SORTANTS :', PAGE_W - MARGIN - 40, cursorY + 5, { align: 'right' });
  doc.setTextColor(RED);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(data.totalExpenses), PAGE_W - MARGIN, cursorY + 5, { align: 'right' });

  doc.setTextColor(TEXT_GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('SOLDE NET DU MOIS :', PAGE_W - MARGIN - 40, cursorY + 12, { align: 'right' });
  doc.setTextColor(solde >= 0 ? PRIMARY : RED);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(fmt(solde), PAGE_W - MARGIN, cursorY + 12, { align: 'right' });

  // ——— 7. FOOTER ———
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // Dark footer line
    doc.setDrawColor('#E5E7EB');
    doc.setLineWidth(0.2);
    doc.line(MARGIN, 282, PAGE_W - MARGIN, 282);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_LIGHT);
    doc.text(
      `Document officiel MoneyFlow - Identiant unique: MF-${data.year}${data.month}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      MARGIN, 287
    );
    doc.text(`Page ${p} / ${totalPages}`, PAGE_W - MARGIN, 287, { align: 'right' });
  }

  // ——— 8. SAVE ———
  const filename = `MoneyFlow_Rapport_${monthNamesFr[data.month - 1]}_${data.year}.pdf`;
  doc.save(filename);
}
