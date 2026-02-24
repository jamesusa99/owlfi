/** 从任意 catch 中取出可展示的错误文案，任何地方报错都要把错误提示出来 */
export function getErrorMessage(e: unknown, fallback = '操作失败'): string {
  if (e == null) return fallback
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message || fallback
  if (typeof e === 'object' && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message
  }
  if (typeof e === 'object' && 'error' in e && typeof (e as { error: unknown }).error === 'string') {
    return (e as { error: string }).error
  }
  return String(e)
}
