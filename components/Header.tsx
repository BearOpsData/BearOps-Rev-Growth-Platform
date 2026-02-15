import Image from 'next/image'

export default function Header() {
  return (
    <div className="header">
      <Image
        src="/images/BearOps_Logo_Default.png"
        alt="BearOps Logo"
        width={200}
        height={50}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        priority
      />
      <div className="logo">BearOps</div>
      <h1 className="tagline">Scale Revenue Infrastructure</h1>
      <p className="subtitle">Clarity that Scales, Structure that Performs</p>
    </div>
  )
}

