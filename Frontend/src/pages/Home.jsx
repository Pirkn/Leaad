function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Marketing Agent
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your AI-powered marketing assistant for creating viral content and
          engaging campaigns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Content Creation</h3>
            <p className="text-gray-600">
              Generate viral posts and engaging content with AI assistance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Campaign Management</h3>
            <p className="text-gray-600">
              Plan and execute marketing campaigns with smart insights.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-gray-600">
              Track performance and optimize your marketing strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
