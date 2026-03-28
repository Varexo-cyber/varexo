import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HelpWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: t('help.question1'),
      answer: t('help.answer1')
    },
    {
      question: t('help.question2'),
      answer: t('help.answer2')
    },
    {
      question: t('help.question3'),
      answer: t('help.answer3')
    },
    {
      question: t('help.question4'),
      answer: t('help.answer4')
    },
    {
      question: t('help.question5'),
      answer: t('help.answer5')
    },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      {/* FAQ Panel */}
      {isOpen && (
        <div className="mb-3 w-80 glass-card rounded-xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t('help.title')}</p>
                  <p className="text-primary-100 text-xs">{t('help.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-3 max-h-80 overflow-y-auto space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  className="w-full text-left px-4 py-3 bg-dark-700/50 hover:bg-dark-700 border border-dark-600/50 rounded-lg text-sm transition flex items-center justify-between gap-2"
                >
                  <span className="text-gray-200 font-medium">{faq.question}</span>
                  <svg
                    className={`w-4 h-4 text-primary-400 flex-shrink-0 transition-transform duration-200 ${
                      activeQuestion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeQuestion === index && (
                  <div className="px-4 py-3 bg-dark-800/50 border border-dark-600/30 border-t-0 rounded-b-lg">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-dark-700/50">
            <a
              href="/contact"
              className="block w-full text-center bg-primary-500 text-dark-900 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-400 transition"
            >
              {t('help.askQuestion')}
            </a>
          </div>
        </div>
      )}

      {/* Help FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-dark-700 scale-90'
            : 'bg-primary-500 hover:bg-primary-400 hover:scale-110 animate-pulse-glow'
        }`}
        aria-label={t('help.title')}
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default HelpWidget;
