import Link from 'next/link'

export function Footer() {
  return (
    <div className="p-4 text-lg">
      <p>
        Built by{' '}
        <Link
          href="https://github.com/mauriciotp"
          target="blank"
          className="hover:underline"
        >
          @mauriciotp
        </Link>
      </p>
    </div>
  )
}
