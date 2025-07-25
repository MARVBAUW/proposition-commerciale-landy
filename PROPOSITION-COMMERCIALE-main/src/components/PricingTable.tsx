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
      <td className="px-4 py-3 text-gray-700">{title}</td>
      <td className="px-4 py-3 text-right text-gray-900 font-mono whitespace-nowrap">{htAmount}</td>
      <td className="px-4 py-3 text-right text-gray-600 font-mono whitespace-nowrap">{tva}</td>
      <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#c1a16a' }} whitespace-nowrap>{ttcAmount}</td>
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
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#787346' }}>
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-3 text-gray-600">Poste</th>
              <th className="text-right px-4 py-3 text-gray-600 whitespace-nowrap">Montant HT</th>
              <th className="text-right px-4 py-3 text-gray-600 whitespace-nowrap">TVA 20%</th>
              <th className="text-right px-4 py-3 text-gray-600 whitespace-nowrap">Montant TTC</th>
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