import { CallToAction } from './_components/call-to-action'

export default function Home() {
  return (
    <div className="flex-1 content-center text-center">
      <h1 className="mb-2 text-3xl font-bold">Log in and play with us</h1>
      <p className="mb-4 text-xl">Play Rock Paper Scissors and earn prizes.</p>
      <CallToAction />
    </div>
  )
}
