export const CardTile = ({ title, href, imageLightSrc, imageDarkSrc, children }) => {
  return (
    <a
      href={href}
      className="card-tile block font-normal group relative my-2 ring-2 ring-transparent rounded-2xl bg-white dark:bg-background-dark border border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light"
    >
      {imageLightSrc && <img className="w-full m-0 block dark:hidden" src={imageLightSrc} alt={title} />}
      {imageDarkSrc && <img className="w-full m-0 hidden dark:block" src={imageDarkSrc} alt={title} />}
      {title && <h2 className="mt-4 mb-2 px-6 text-base font-semibold">{title}</h2>}
      <div className="px-6 pb-5">{children}</div>
    </a>
  );
};
