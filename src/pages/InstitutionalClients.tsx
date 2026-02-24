import { useNavigate } from 'react-router-dom'

export default function InstitutionalClients() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-bold text-[var(--owl-text)] mb-2">机构客户</h2>
        <p className="text-2xl font-bold text-[var(--owl-primary)] mb-4">200+ 机构信赖之选</p>
        <p className="text-[var(--owl-text-muted)] leading-relaxed mb-4">
          猫头鹰基金研究院为银行、保险、信托、券商等金融机构提供专业的基金投研与组合管理服务。
          依托丰富的路演积累、海量特色标签与深度调研能力，助力机构提升持基体验、优化资产配置。
        </p>
        <p className="text-[var(--owl-text-muted)] leading-relaxed">
          累计服务 200+ 机构客户，覆盖广、专业强。如需机构合作咨询，欢迎联系我们。
        </p>
      </div>
      <button
        onClick={() => navigate('/profile/support')}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl font-medium"
      >
        联系机构服务
      </button>
      <button
        onClick={() => navigate('/profile/help/about')}
        className="w-full mt-3 py-2 text-[var(--owl-text-muted)] text-sm"
      >
        关于我们
      </button>
    </div>
  )
}
