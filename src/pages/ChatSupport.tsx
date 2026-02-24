import { useNavigate } from 'react-router-dom'

export default function ChatSupport() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[70vh]">
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 overflow-auto">
        <div className="bg-[var(--owl-bg)] rounded-xl p-3 max-w-[80%] mb-4">
          <p className="text-sm text-[var(--owl-text)]">您好！请问有什么可以帮您？</p>
          <p className="text-xs text-[var(--owl-text-muted)] mt-1">客服 刚刚</p>
        </div>
        <p className="text-center text-sm text-[var(--owl-text-muted)] py-4">对话已连接，请描述您的问题</p>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="输入您的问题..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
        />
        <button className="px-6 py-3 bg-[var(--owl-primary)] text-white rounded-xl">
          发送
        </button>
      </div>
      <button
        onClick={() => navigate('/profile/support')}
        className="mt-4 text-sm text-[var(--owl-text-muted)]"
      >
        返回客服中心
      </button>
    </div>
  )
}
