import React from 'react';

interface PricingRowProps {
  title: string;
  htAmount: string;
  tva: string;
  ttcAmount: string;
  isSubtotal?: boolean;
}

const PricingRow: React.FC<PricingRowProps> = ({ title, htAmount, tva, ttcAmount, isSubtotal = false }) => {
  const baseClass = isSubtotal 
    ? "bg-gray-100 font-semibold border-t-2" 
    : "bg-gray-50/50 hover:bg-gray-100 transition-colors";
  
  const borderStyle = isSubtotal ? { borderTopColor: '#c1a16a' } : {};
  
  return (
    <tr className={baseClass} style={borderStyle}>
      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm">{title}</td>
      <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">{htAmount}</td>
      <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">{tva}</td>
      <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-semibold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>{ttcAmount}</td>
    </tr>
  );
};

interface PricingSectionProps {
  title: string;
  icon: string;
  rows: Array<{
    title: string;
    htAmount: string;
    tva: string;
    ttcAmount: string;
  }>;
  subtotal: {
    htAmount: string;
    tva: string;
    ttcAmount: string;
  };
}

const PricingSection: React.FC<PricingSectionProps> = ({ title, icon, rows, subtotal }) => {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm mb-4 sm:mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center" style={{ color: '#787346' }}>
        <span className="mr-1 sm:mr-2 text-sm sm:text-base">{icon}</span>
        <span className="text-sm sm:text-base">{title}</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">Poste</th>
              <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">Montant HT</th>
              <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">TVA 20%</th>
              <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <PricingRow key={index} {...row} />
            ))}
            <PricingRow 
              title={`SOUS-TOTAL ${title.toUpperCase()}`}
              {...subtotal}
              isSubtotal={true}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingSection;