-- 系统公告（单条，后台编辑、首页展示）
CREATE TABLE IF NOT EXISTS system_announcement (
  id INT PRIMARY KEY DEFAULT 1,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE system_announcement IS '系统公告，仅保留一条';

-- 确保有一条记录
INSERT INTO system_announcement (id, content) VALUES (1, '')
ON CONFLICT (id) DO NOTHING;

-- 更新时自动更新 updated_at
DROP TRIGGER IF EXISTS set_updated_at ON system_announcement;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON system_announcement FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE system_announcement ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for system_announcement" ON system_announcement;
CREATE POLICY "Allow all for system_announcement" ON system_announcement FOR ALL USING (true) WITH CHECK (true);
