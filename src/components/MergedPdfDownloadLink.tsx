import React from 'react';
import { pdf } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import { mergePdfsWithPlans } from '../utils/pdfMerger';

interface MergedPdfDownloadLinkProps {
  solution: 'coliving' | 'logements';
  fileName: string;
  className: string;
  children: (props: { loading: boolean }) => React.ReactNode;
}

const MergedPdfDownloadLink: React.FC<MergedPdfDownloadLinkProps> = ({
  solution,
  fileName,
  className,
  children
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    setLoading(true);
    
    try {
      // Générer le PDF de la proposition
      const proposalPdfBlob = await pdf(<PdfDocument solution={solution} />).toBlob();
      const proposalPdfBytes = new Uint8Array(await proposalPdfBlob.arrayBuffer());
      
      // Fusionner avec le plan PDF correspondant
      const mergedPdfBytes = await mergePdfsWithPlans(proposalPdfBytes, solution);
      
      // Créer un blob et déclencher le téléchargement
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(mergedBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading merged PDF:', error);
      // En cas d'erreur, télécharger seulement la proposition
      const proposalPdfBlob = await pdf(<PdfDocument solution={solution} />).toBlob();
      const url = URL.createObjectURL(proposalPdfBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDownload} className={className} disabled={loading}>
      {children({ loading })}
    </button>
  );
};

export default MergedPdfDownloadLink;