// @flow strict
import Link from 'next/link';

function Footer() {
  return (
    <div className="relative border-t bg-canvas border-border text-text-secondary">
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <p className="text-sm font-mono">
            © {new Date().getFullYear()} <Link target="_blank" href="https://www.linkedin.com/in/harirajan-sujith-784a861a4/" className="text-accent">Sujith</Link>
          </p>
        </div>
      </div>
    </div >
  );
};

export default Footer;