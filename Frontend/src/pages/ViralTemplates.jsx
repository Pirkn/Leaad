function ViralTemplates() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Viral Templates
        </h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
          Create New Template
        </button>
      </div>

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Templates
          </h3>
          <p className="text-2xl font-semibold text-gray-900">89</p>
          <p className="text-xs text-gray-500">+5 this week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Active
          </h3>
          <p className="text-2xl font-semibold text-gray-900">67</p>
          <p className="text-xs text-gray-500">75% of total</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Viral Posts
          </h3>
          <p className="text-2xl font-semibold text-gray-900">234</p>
          <p className="text-xs text-gray-500">+23 this month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Avg. Engagement
          </h3>
          <p className="text-2xl font-semibold text-gray-900">12.4%</p>
          <p className="text-xs text-gray-500">+2.1% from last month</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Template Card 1 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Social Media Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "🔥 The secret that changed my business forever..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 45 times</span>
              <span>8.2% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 2 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Question Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "What if I told you there's a way to..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 32 times</span>
              <span>11.5% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 3 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Story Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700">
                Draft
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "Last year, I was struggling with..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 18 times</span>
              <span>6.8% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 4 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Number Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "7 ways to instantly improve your..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 56 times</span>
              <span>14.2% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 5 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Controversy Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "Why most people fail at..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 28 times</span>
              <span>9.7% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Template Card 6 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Benefit Hook
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700">
                Draft
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              "Transform your business in 30 days..."
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Used 12 times</span>
              <span>5.3% engagement</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                Edit
              </button>
              <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                Duplicate
              </button>
              <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViralTemplates;
