import Link from 'next/link';

const FOOTER_LINKS = [
  {
    header: 'Categories',
    links: [
      {
        href: '#',
        label: 'Dogs',
      },
      {
        href: '#',
        label: 'Cats',
      },
      {
        href: '#',
        label: 'Birds',
      },
    ],
  },
  {
    header: 'USEFUL LINKS',
    links: [
      {
        href: '#',
        label: 'About Us',
      },
      {
        href: '#',
        label: 'Terms of Use',
      },
      {
        href: '#',
        label: 'Privacy Policy',
      },
    ],
  },
  {
    header: 'SOCIAL MEDIA',
    links: [
      {
        href: '#',
        label: 'Twitter',
      },
      {
        href: '#',
        label: 'Facebook',
      },
      {
        href: '#',
        label: 'LinkedIn',
      },
      {
        href: '#',
        label: 'Instagram',
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-[1px] border-t-black bg-white py-4">
      {/* First Section */}
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between px-5 sm:flex-row">
        <Link href="/" className="flex h-fit items-center">
          <img src="/icons/logo.svg" alt="Avitox's logo" className="h-10" />{' '}
          <span className="text-2xl font-bold">X</span>
        </Link>
        <div className="flex flex-col justify-evenly sm:justify-end md:flex-row lg:w-[70vw]">
          {FOOTER_LINKS.map(({ header, links }, idx) => (
            <div
              className="mt-4 sm:ml-10 md:ml-16 lg:mt-0 xl:ml-24"
              key={header + idx}
            >
              <ul className="xs:space-y-1">
                {links.map(({ href, label }, index) => (
                  <li key={label + idx + index}>
                    <Link
                      href={href}
                      className="hover:drop-shadow-light hover:dark:drop-shadow-dark text-sm opacity-50 transition-all ease-in-out hover:opacity-100 md:text-base"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Second Section */}
      <div className="mt-8 px-4 pt-4 lg:mt-0 lg:pt-0 xl:px-0">
        <div className="mx-auto flex flex-col items-center justify-between md:flex-row">
          <div className="text-theme mx-auto w-fit border-t-2 border-gray-300 text-center text-sm">
            ©2024 Avitox LTD. All rights reserved.
          </div>
          {/* <div className="mt-2 flex space-x-4 md:mt-0">
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl p-2 opacity-80 transition-all ease-in-out hover:opacity-100 hover:shadow-lg hover:shadow-black dark:invert md:opacity-50"
            >
              <X />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl p-2 opacity-80 transition-all ease-in-out hover:opacity-100 hover:shadow-lg hover:shadow-black dark:invert md:opacity-50"
            >
              <Facebook />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl p-2 opacity-80 transition-all ease-in-out hover:opacity-100 hover:shadow-lg hover:shadow-black dark:invert md:opacity-50"
            >
              <Linkedin />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl p-2 opacity-80 transition-all ease-in-out hover:opacity-100 hover:shadow-lg hover:shadow-black dark:invert md:opacity-50"
            >
              <Instagram />
            </Link>
            <Link
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl p-2 opacity-80 transition-all ease-in-out hover:opacity-100 hover:shadow-lg hover:shadow-black dark:invert md:opacity-50"
            >
              <Pinterest />
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
