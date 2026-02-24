import { courses } from '../data/courses'

export default function AdminCourses() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">课程管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">课程名称</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">类型</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">课时数</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.title}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.lessons.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
