// @flow strict
import Link from 'next/link';

function Footer() {
  return (
    <div className="relative border-t bg-canvas border-border text-text-secondary">
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex justify-center -z-40">
          <div className="absolute top-0 h-[1px] w-1/2  bg-gradient-to-r from-transparent via-border-strong to-transparent"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <p className="text-sm font-mono">
            © Developer Portfolio by <Link target="_blank" href="https://www.linkedin.com/in/harirajan-sujith-784a861a4/" className="text-accent">Sujith</Link>
          </p>
        </div>
      </div>
    </div >
  );
};

export default Footer;