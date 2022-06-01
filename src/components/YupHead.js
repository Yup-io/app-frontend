import Head from 'next/head';

const YupHead = ({ title, description, image, meta }) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      {title && <title>{title}</title>}
      {description && <meta property="description" content={description} />}
      {image && <meta property="image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yup_io" />

      {Object.entries(meta || {}).map(([k, v]) => (
        <meta key={k} name={k} content={v} />
      ))}
    </Head>
  );
};

export default YupHead;
