import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
}

interface Props {
  customerEmail: string;
  customerName: string;
  hasMandate: boolean;
  invoiceId?: string;
  amount?: number;
  onSuccess?: () => void;
}

const AdminIncassoButton: React.FC<Props> = ({ 
  customerEmail, 
  customerName, 
  hasMandate, 
  onSuccess 
}) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [result, setResult] = useState<{status: string; message: string} | null>(null);

  useEffect(() => {
    if (showPanel && products.length === 0) {
      fetch('/.netlify/functions/mollie-products')
        .then(r => r.json())
        .then(d => setProducts(d.products || []))
        .catch(() => {});
    }
  }, [showPanel]);

  const total = selectedProducts.reduce((sum, sp) => sum + sp.product.price * sp.quantity, 0);

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(sp => sp.product.id === product.id);
      if (exists) return prev.filter(sp => sp.product.id !== product.id);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    setSelectedProducts(prev => prev.map(sp => sp.product.id === productId ? { ...sp, quantity: qty } : sp));
  };

  const handleIncasso = async () => {
    if (selectedProducts.length === 0) {
      setResult({ status: 'error', message: language === 'nl' ? 'Selecteer minimaal 1 product' : 'Select at least 1 product' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/.netlify/functions/incasseren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          amount: total,
          description: selectedProducts.map(sp => `${sp.quantity}x ${sp.product.name}`).join(', '),
          products: selectedProducts.map(sp => ({
            name: sp.product.name,
            quantity: sp.quantity,
            unitPrice: sp.product.price,
            total: sp.product.price * sp.quantity
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult({ status: 'success', message: language === 'nl' ? 'Incasso succesvol gestart!' : 'Direct debit started!' });
        setShowPanel(false);
        setSelectedProducts([]);
        onSuccess?.();
      } else {
        setResult({ status: 'error', message: data.error || 'Fout' });
      }
    } catch {
      setResult({ status: 'error', message: language === 'nl' ? 'Verbindingsfout' : 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  if (!hasMandate) return null;

  return (
    <div className="space-y-2">
      {result && (
        <div className={`p-2 rounded-lg text-xs ${result.status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {result.message}
        </div>
      )}

      {!showPanel ? (
        <button
          onClick={() => setShowPanel(true)}
          className="w-full bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-semibold hover:bg-primary-400 transition text-sm"
        >
          {language === 'nl' ? 'Incasseren' : 'Collect Payment'}
        </button>
      ) : (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 space-y-3 min-w-[320px]">
          <div className="flex justify-between items-center">
            <p className="text-white font-semibold text-sm">{language === 'nl' ? 'Producten selecteren' : 'Select products'}</p>
            <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {products.map(product => {
              const selected = selectedProducts.find(sp => sp.product.id === product.id);
              return (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg border cursor-pointer transition ${selected ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-dark-400'}`}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium">{product.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{product.description}</p>
                    </div>
                    <p className="text-primary-400 font-bold text-sm ml-2">€{product.price.toFixed(2)}</p>
                  </div>
                  {selected && (
                    <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => updateQty(product.id, selected.quantity - 1)} className="w-6 h-6 bg-dark-700 rounded text-white text-xs hover:bg-dark-600">-</button>
                      <span className="text-white text-xs w-6 text-center">{selected.quantity}</span>
                      <button onClick={() => updateQty(product.id, selected.quantity + 1)} className="w-6 h-6 bg-dark-700 rounded text-white text-xs hover:bg-dark-600">+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedProducts.length > 0 && (
            <div className="border-t border-dark-600 pt-3">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-400 text-sm">{language === 'nl' ? 'Totaal' : 'Total'}</p>
                <p className="text-white font-bold">€{total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleIncasso}
                disabled={loading}
                className="w-full bg-primary-500 text-dark-900 px-4 py-2.5 rounded-lg font-bold hover:bg-primary-400 transition disabled:opacity-50 text-sm"
              >
                {loading ? '⏳ Bezig...' : `💳 Incasseer €${total.toFixed(2)} van ${customerName}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminIncassoButton;
