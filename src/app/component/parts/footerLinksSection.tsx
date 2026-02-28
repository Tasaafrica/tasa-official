const categories = [
    'Digital Marketing',
    'Programming',
    'Creative and Artistic',
    'Vocational & Technical',
    'Sport & Fitness',
    'Education & Tutoring',
    'Photography',
    'Writing and Translation',
    'AI Services',
    'Music and Audio',
    'Graphics & Design',
    'Video and Animation',
  ];
  
  const clientsLinks = [
    'How TASA Works',
    'Customer Success Stories',
    'Trust & Safety',
    'Quality Guide',
    'TASA Learn - Online Courses',
    'TASA Guides',
  ];
  
  const freelancersLinks = [
    'Become a TASA Freelancer',
    'Become an Agency',
    'Freelancer Equity Program',
    'Community Hub',
    'Forum',
    'Events',
  ];
  
  const businessLinks = [
    'TASA Pro',
    'Project Management Service',
    'ClearVoice - Content Marketing',
    'Working Not Working - Creative Talent',
    'Contact Sales',
  ];
  
  const companyLinks = [
    'About TASA',
    'Careers',
    'Press & News',
    'Partnerships',
    'Privacy Policy',
    'Terms of Service',
    'Investor Relations',
  ];
  
  const columns = [
    {
      title: 'Categories',
      links: categories,
    },
    {
      title: 'For Clients',
      links: clientsLinks,
    },
    {
      title: 'For Freelancers',
      links: freelancersLinks,
    },
    {
      title: 'Business Solutions',
      links: businessLinks,
    },
    {
      title: 'Company',
      links: companyLinks,
    },
  ];
  
  import { FaXTwitter, FaFacebook, FaLinkedin } from "react-icons/fa6";
  
  const FooterLinksSection = () => (
    <div className="mx-auto text-center bg-[#334155] w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-lg font-semibold mb-4 text-white">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-teal-600">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Footer - A simple copyright, main footer likely in layout.tsx */}
      <footer className="py-8 text-sm text-slate-500 dark:text-slate-400 bg-gray-100">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
      {/* Logo left */}
      <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
        <img src="/logo/text_black.png" alt="TASA Logo" className="h-8" />
      </div>
      {/* Copyright center */}
      <div className="flex-1 text-center">
        <p>&copy; {new Date().getFullYear()} TASA - Skill and Service Hub. All rights reserved.</p>
      </div>
      {/* Social icons right */}
      <div className="flex items-center justify-center md:justify-end w-full md:w-auto gap-4 px-2">
    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-teal-600 transition-colors p-2">
      <FaXTwitter className="h-5 w-5" />
    </a>
    <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-teal-600 transition-colors p-2">
      <FaFacebook className="h-5 w-5" />
    </a>
    <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-teal-600 transition-colors p-2">
      <FaLinkedin className="h-5 w-5" />
    </a>
  </div>
    </div>
  </footer>
    </div>
  );
  
  export default FooterLinksSection;
  