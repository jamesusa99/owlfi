export default function AdminSettings() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">系统设置</h1>
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-4">系统公告</h3>
          <textarea
            placeholder="输入系统公告内容..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
          <button className="mt-3 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            保存
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-4">市场指标</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-[#6b7c8d]">股债利差</span>
              <input type="text" defaultValue="4.40%" className="w-24 px-2 py-1 border rounded text-right" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#6b7c8d]">市场温度</span>
              <input type="text" defaultValue="66.12°C" className="w-24 px-2 py-1 border rounded text-right" />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            更新
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">版本信息</h3>
          <p className="text-[#6b7c8d] text-sm">猫头鹰基金研究院 v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
