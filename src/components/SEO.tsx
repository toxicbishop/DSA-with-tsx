import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export const SEO = ({ title, description, image, article }: SEOProps) => {
  const router = useRouter();
  const siteName = "DSA Study Hub";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Master Data Structures & Algorithms with interactive visualizations and comprehensive study materials.";
  const baseUrl = "https://dsa-study-hub.vercel.app";
  const url = `${baseUrl}${router.asPath === '/' ? '' : router.asPath}`;
  
  // Default social image - you should place an image at public/og-image.png
  const siteImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.png`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Search Engine specific */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
};
