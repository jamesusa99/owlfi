import { Link } from 'react-router-dom'

export default function AdminClassroom() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">投顾学院管理</h1>
      <p className="text-sm text-[#6b7c8d] mb-6">
        投顾学院区块、分类标签、知识领域、认证体系等配置已移至
        <Link to="/admin/home-config" className="text-[#1e3a5f] ml-1 font-medium">首页配置</Link>。
      </p>
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/instructors" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          👤 讲师库
        </Link>
        <Link to="/admin/series" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          📂 系列课
        </Link>
        <Link to="/admin/courses" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          📚 课程管理
        </Link>
      </div>
    </div>
  )
}
