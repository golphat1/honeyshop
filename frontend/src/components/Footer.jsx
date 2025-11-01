import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-dark text-white mt-12">
      <div className="container py-8 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold text-lg">HoneyShop</div>
          <p className="mt-2 text-sm">Pure Kenyan honey — exported globally.</p>
        </div>

        <div>
          <div className="font-semibold">Contact</div>
          <div className="text-sm mt-2">Kenya: +254 712 345 678</div>
          <div className="text-sm">UK: +44 7456 123 456</div>
          <div className="text-sm mt-2">Email: info@honeyshop.co.ke</div>
        </div>

        <div>
          <div className="font-semibold">Export</div>
          <div className="text-sm mt-2">We export honey to the UK, EU and worldwide. Wholesale & export enquiries welcome.</div>
        </div>
      </div>
      <div className="text-center py-3 text-sm bg-black/20">© {new Date().getFullYear()} HoneyShop</div>
    </footer>
  )
}
