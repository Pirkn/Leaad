export default function Failure() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Payment Failed</h1>
        <p className="text-gray-700">The payment did not complete. Please try again with the test card details.</p>
      </div>
    </div>
  );
}


