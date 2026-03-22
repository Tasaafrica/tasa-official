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
  ];
  
  const freelancersLinks = [
    'Become a TASA Vendor',
    'TASA for minors',
    'Vendor Support',
    'Vendor Resources',
    'Events',
  ];
  
  const businessLinks = [
    'TASA Pro',
    'Project Management Service',
    'ClearVoice - Content Marketing',
    'Contact Sales',
  ];
  
  const companyLinks = [
    'About TASA',
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
      title: 'For Vendors',
      links: freelancersLinks,
    },
    {
      title: 'Company',
      links: companyLinks,
    },
  ];
  
  import { FaXTwitter, FaFacebook, FaLinkedin } from "react-icons/fa6";
  
  const FooterLinksSection = () => (
    <div className="mx-auto bg-[#334155] w-full border-t border-slate-700">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-bold mb-5 text-white uppercase tracking-wider">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Footer - A simple copyright, main footer likely in layout.tsx */}
      <footer className="py-8 text-sm text-slate-500 dark:text-slate-400">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
      {/* Logo left */}
      <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
        <img src="/logo/white_logo.png" alt="TASA Logo" className="h-7" />
      </div>
      {/* Copyright center */}
      <div className="flex-1 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} TASA - Skill and Service marketplace. All rights reserved.</p>
      </div>
      {/* Social icons right */}
      <div className="flex items-center justify-center md:justify-end w-full md:w-auto gap-4 px-2 text-gray-300">
    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#CCFBF1] transition-colors p-2">
      <FaXTwitter className="h-5 w-5" />
    </a>
    <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#CCFBF1] transition-colors p-2">
      <FaFacebook className="h-5 w-5" />
    </a>
    <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#CCFBF1] transition-colors p-2">
      <FaLinkedin className="h-5 w-5" />
    </a>
  </div>
    </div>
  </footer>
    </div>
  );
  
  export default FooterLinksSection;
  