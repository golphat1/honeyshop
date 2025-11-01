import React from 'react'
export default function Contact(){
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">Kenya Office</h3>
          <p>Nairobi, Kenya</p>
          <p>Email: info@honeyshop.co.ke</p>
          <p>Phone: +254 712 345 678</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">UK Office</h3>
          <p>London, United Kingdom</p>
          <p>Email: uk@honeyshop.com</p>
          <p>Phone: +44 7456 123 456</p>
        </div>
      </div>
    </div>
  )
}
