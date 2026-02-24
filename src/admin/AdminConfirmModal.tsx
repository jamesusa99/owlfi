interface Props {
  title: string
  onConfirm: () => void
  onCancel: () => void
}

export default function AdminConfirmModal({ title, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-[#1a2b3c] font-medium mb-4">{title}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-lg">
            确认删除
          </button>
          <button onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-lg text-[#6b7c8d]">
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
