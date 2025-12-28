"use client";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm text-gray-600">
          <a
            href="/shipping"
            className="hover:text-blue-600 transition-colors"
          >
            Shipping
          </a>
          <a
            href="/terms"
            className="hover:text-blue-600 transition-colors"
          >
            Terms and Conditions
          </a>
          <a
            href="/refund"
            className="hover:text-blue-600 transition-colors"
          >
            Cancellation & Refunds
          </a>
        </div>
      </div>
    </footer>
  );
}