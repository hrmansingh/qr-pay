export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation & Refund Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated on Dec 20th 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              <strong>MOHIT</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
            </p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                Cancellations will be considered only if the request is made within <strong>Not Applicable</strong> of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
              </li>
              
              <li>
                MOHIT does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
              </li>
              
              <li>
                In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within <strong>Not Applicable</strong> of receipt of the products.
              </li>
              
              <li>
                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>Not Applicable</strong> of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
              </li>
              
              <li>
                In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
              </li>
              
              <li>
                In case of any Refunds approved by the MOHIT, it'll take <strong>Not Applicable</strong> for the refund to be processed to the end customer.
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