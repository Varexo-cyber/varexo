import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  language?: 'nl' | 'en';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  language = 'nl',
}) => {
  const baseUrl = 'https://varexo.nl';

  // Avoid duplicate brand name if title already contains "Varexo"
  const fullTitle = /varexo/i.test(title) ? title : `${title} | Varexo`;

  // Build absolute canonical URL
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : baseUrl;

  // OG image fallback
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${baseUrl}${ogImage}`
    : `${baseUrl}/og-image.png`;

  const locale = language === 'en' ? 'en_GB' : 'nl_NL';

  return (
    <Helmet>
      {/* Primary */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Varexo" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEO;
