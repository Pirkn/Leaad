function Leads() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Leads Management
      </h1>

      {/* Lead Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Leads
          </h3>
          <p className="text-2xl font-semibold text-gray-900">1,234</p>
          <p className="text-xs text-gray-500">+12% from last month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Converted
          </h3>
          <p className="text-2xl font-semibold text-gray-900">567</p>
          <p className="text-xs text-gray-500">+8% from last month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Conversion Rate
          </h3>
          <p className="text-2xl font-semibold text-gray-900">45.9%</p>
          <p className="text-xs text-gray-500">+2.1% from last month</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50">
                      <span className="text-xs font-medium text-gray-600">
                        JD
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        John Doe
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    john.doe@example.com
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                    Viral Template
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700">
                    New
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  2 hours ago
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50">
                      <span className="text-xs font-medium text-gray-600">
                        JS
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Jane Smith
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    jane.smith@example.com
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                    Campaign
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700">
                    Converted
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  1 day ago
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50">
                      <span className="text-xs font-medium text-gray-600">
                        MJ
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Mike Johnson
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    mike.johnson@example.com
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                    Social Media
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                    Contacted
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  3 days ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leads;
