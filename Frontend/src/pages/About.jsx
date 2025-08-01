function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Marketing Agent
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            We're revolutionizing digital marketing by combining cutting-edge AI
            technology with proven marketing strategies. Our platform helps
            businesses create compelling content that resonates with their
            audience and drives real results.
          </p>
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Generate viral social media content</li>
            <li>Create engaging marketing campaigns</li>
            <li>Provide data-driven insights</li>
            <li>Optimize content for maximum engagement</li>
            <li>Automate repetitive marketing tasks</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
            <p className="text-gray-600">
              Leveraging the latest in artificial intelligence to create content
              that captures attention and drives engagement.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Data-Driven</h3>
            <p className="text-gray-600">
              Making informed decisions based on real-time analytics and
              performance metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
