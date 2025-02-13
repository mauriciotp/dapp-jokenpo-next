import Image from 'next/image'
import Link from 'next/link'

export function InstallMetamaskLink() {
  return (
    <Link
      className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 transition hover:bg-orange-200"
      href="https://metamask.io/"
      target="blank"
    >
      <Image
        width={40}
        height={40}
        src="/assets/metamask.svg"
        alt="Metamask logo"
      />
      <p className="text-xl font-bold text-black">Install MetaMask</p>
    </Link>
  )
}
