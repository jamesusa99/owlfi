/**
 * 后台表单统一标签：标出必填/选填，以及格式说明，避免保存失败
 */
export function FormLabel({
  label,
  required,
  hint,
}: {
  label: string
  required?: boolean
  hint?: string
}) {
  return (
    <div className="mb-1">
      <span className="text-sm font-medium text-[#6b7c8d]">{label}</span>
      {required ? (
        <span className="ml-1 text-red-500 text-xs">*必填</span>
      ) : (
        <span className="ml-1 text-[#9ca3af] text-xs">选填</span>
      )}
      {hint && <p className="text-xs text-[#9ca3af] mt-0.5">{hint}</p>}
    </div>
  )
}
