import { Link } from 'react-router-dom';
import { Vote, Mail, Phone, MapPin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Vote className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">SecureVote</span>
            </div>
            <p className="text-neutral-300 mb-4">
              A modern, secure, and transparent e-voting platform designed to make democracy more accessible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-primary-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/voting" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Vote
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Data Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300">
                  123 Democracy Street, Digital City, DC 10101
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-500" />
                <span className="text-neutral-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-500" />
                <a href="mailto:info@securevote.com" className="text-neutral-300 hover:text-primary-500 transition-colors">
                  info@securevote.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-neutral-400 text-sm">
          <p>© {currentYear} SecureVote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;