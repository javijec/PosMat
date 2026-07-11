const AboutSection = ({ section }) => (
  <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
    <h2 className="border-b border-gray-100 pb-4 text-2xl font-bold tracking-tight text-gray-900">
      {section.title}
    </h2>
    <div
      className="prose prose-slate mt-5 max-w-none text-[1.0625rem] leading-7 prose-a:text-ingenieria prose-a:underline prose-a:underline-offset-2"
      dangerouslySetInnerHTML={{ __html: section.content }}
    />
  </article>
);

export default AboutSection;
