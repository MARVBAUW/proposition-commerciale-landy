import { PDFDocument } from 'pdf-lib';

export const mergePdfsWithPlans = async (proposalPdf: Uint8Array, solution: 'coliving' | 'logements'): Promise<Uint8Array> => {
  try {
    // Créer un nouveau document PDF
    const mergedPdf = await PDFDocument.create();
    
    // Charger le PDF de la proposition
    const proposalPdfDoc = await PDFDocument.load(proposalPdf);
    const proposalPages = await mergedPdf.copyPages(proposalPdfDoc, proposalPdfDoc.getPageIndices());
    
    // Ajouter toutes les pages de la proposition
    proposalPages.forEach((page) => mergedPdf.addPage(page));
    
    // Déterminer quel plan PDF ajouter selon la solution
    const planPdfPath = solution === 'coliving' 
      ? '/PDF/Plans colliving.pdf' 
      : '/PDF/Plans 3 appartements.pdf';
    
    try {
      // Charger le plan PDF depuis le serveur
      const planResponse = await fetch(planPdfPath);
      if (planResponse.ok) {
        const planPdfBytes = await planResponse.arrayBuffer();
        const planPdfDoc = await PDFDocument.load(planPdfBytes);
        const planPages = await mergedPdf.copyPages(planPdfDoc, planPdfDoc.getPageIndices());
        
        // Ajouter toutes les pages du plan
        planPages.forEach((page) => mergedPdf.addPage(page));
      } else {
        console.warn(`Plan PDF not found: ${planPdfPath}`);
      }
    } catch (error) {
      console.warn(`Error loading plan PDF: ${planPdfPath}`, error);
    }
    
    // Retourner le PDF fusionné
    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    // En cas d'erreur, retourner le PDF de proposition original
    return proposalPdf;
  }
};