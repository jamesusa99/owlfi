import { useNavigate } from 'react-router-dom'

const categories = [
  { id: 'all', name: '全部' },
  { id: 'market', name: '市场热议' },
  { id: 'strategy', name: '投资策略' },
  { id: 'qa', name: '答疑解惑' },
]

const posts = [
  { id: 1, title: '如何看待当前市场震荡？我的几点思考', author: '稳健投资', avatar: '👤', category: 'market', replies: 128, likes: 256, time: '2小时前' },
  { id: 2, title: '定投三年收益分享，附实盘记录', author: '长期主义者', avatar: '👤', category: 'strategy', replies: 89, likes: 312, time: '5小时前' },
  { id: 3, title: '新手如何选择第一只基金？', author: '小白理财', avatar: '👤', category: 'qa', replies: 45, likes: 98, time: '1天前' },
  { id: 4, title: '行业轮动策略实操经验谈', author: '量化老王', avatar: '👤', category: 'strategy', replies: 67, likes: 189, time: '2天前' },
]

export default function Forum() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm text-[var(--owl-text-muted)] hover:bg-[var(--owl-primary)] hover:text-white transition-colors"
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/forum/post/${post.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-[var(--owl-text)] line-clamp-2 mb-2">{post.title}</h3>
            <div className="flex items-center justify-between text-sm text-[var(--owl-text-muted)]">
              <span>{post.author}</span>
              <div className="flex gap-4">
                <span>💬 {post.replies}</span>
                <span>❤️ {post.likes}</span>
                <span>{post.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/forum/create')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--owl-primary)] text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform md:bottom-6 z-30"
      >
        +
      </button>
    </div>
  )
}
