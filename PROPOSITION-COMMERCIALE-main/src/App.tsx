import React from 'react';
import Header from './components/Header';
import ProjectSummary from './components/ProjectSummary';
import PricingBreakdown from './components/PricingBreakdown';
import Services from './components/Services';
import TotalSummary from './components/TotalSummary';
import Exclusions from './components/Exclusions';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

function App() {
  return (
    <div id="main-content" className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="avoid-break"><ProjectSummary /></div>
      <div className="avoid-break"><PricingBreakdown /></div>
      <div className="avoid-break"><Services /></div>
      <div className="avoid-break"><TotalSummary /></div>
      <div className="avoid-break"><Exclusions /></div>
      <div className="avoid-break"><Timeline /></div>
      <div className="avoid-break"><Footer /></div>
    </div>
  );
}

export default App;