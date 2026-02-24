-- 首页配置：入口、投顾学院、路演日历

-- 首页入口（组合管理、深度调研等，可增删改排序）
CREATE TABLE IF NOT EXISTS home_services (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📌',
  path TEXT NOT NULL DEFAULT '#',
  sort_order INT NOT NULL DEFAULT 0
);

COMMENT ON TABLE home_services IS '首页服务入口，后台可配置';

-- 仅当表为空时插入默认入口（不含「我的账户」，用户通过「我的」进入）
INSERT INTO home_services (label, icon, path, sort_order)
SELECT v.label, v.icon, v.path, v.sort_order FROM (VALUES
  ('组合管理', '📁', '/portfolio', 1),
  ('基金诊断', '📊', '/research/diagnosis', 2),
  ('深度调研', '🔍', '/research/reports', 3),
  ('挖宝专区', '💎', '/treasure', 4),
  ('猫头鹰连线', '💬', '/forum', 5),
  ('基金画像', '📈', '/research/fund-profile', 6),
  ('路演日历', '📅', '/roadshow', 7),
  ('精选课堂', '📚', '/classroom', 8),
  ('市场资讯', '📰', '/news', 9),
  ('更多', '⋯', '/classroom', 10)
) AS v(label, icon, path, sort_order)
WHERE (SELECT COUNT(*) FROM home_services) = 0;

-- 投顾学院区块配置（标题 + 分类标签）
CREATE TABLE IF NOT EXISTS home_classroom_config (
  id INT PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT '投顾学院',
  category_tabs JSONB NOT NULL DEFAULT '["基金经理精选","基金比较研究","ETF策略研究","绝对收益策略","基金组合配置"]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO home_classroom_config (id, title, category_tabs)
VALUES (1, '投顾学院', '["基金经理精选","基金比较研究","ETF策略研究","绝对收益策略","基金组合配置"]')
ON CONFLICT (id) DO NOTHING;

-- 路演日历区块配置
CREATE TABLE IF NOT EXISTS home_roadshow_config (
  id INT PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT '路演日历',
  path TEXT NOT NULL DEFAULT '/roadshow',
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO home_roadshow_config (id, title, path, enabled)
VALUES (1, '路演日历', '/roadshow', true)
ON CONFLICT (id) DO NOTHING;

-- 触发器
DROP TRIGGER IF EXISTS set_updated_at ON home_classroom_config;
DROP TRIGGER IF EXISTS set_updated_at ON home_roadshow_config;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON home_classroom_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON home_roadshow_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE home_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_classroom_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_roadshow_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for home_services" ON home_services;
DROP POLICY IF EXISTS "Allow all for home_classroom_config" ON home_classroom_config;
DROP POLICY IF EXISTS "Allow all for home_roadshow_config" ON home_roadshow_config;
CREATE POLICY "Allow all for home_services" ON home_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for home_classroom_config" ON home_classroom_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for home_roadshow_config" ON home_roadshow_config FOR ALL USING (true) WITH CHECK (true);
