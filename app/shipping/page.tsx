export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping & Delivery Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated on Dec 20th 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <ul className="list-disc pl-6 space-y-4">
              <li>
                For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.
              </li>
              
              <li>
                For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
              </li>
              
              <li>
                Orders are shipped within <strong>Not Applicable</strong> or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
              </li>
              
              <li>
                MOHIT is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within <strong>Not Applicable</strong> from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
              </li>
              
              <li>
                Delivery of all orders will be to the address provided by the buyer.
              </li>
              
              <li>
                Delivery of our services will be confirmed on your mail ID as specified during registration.
              </li>
              
              <li>
                For any issues in utilizing our services you may contact our helpdesk on <strong>7986104250</strong> or <a href="mailto:paybyqr01@gmail.com" className="text-blue-600 hover:text-blue-800">paybyqr01@gmail.com</a>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Disclaimer:</strong> The above content is created at MOHIT's sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant's non-adherence to it.
              </p>
            </div>

            <div className="mt-6 text-center">
              <a 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}