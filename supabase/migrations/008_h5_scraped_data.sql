-- H5 抓取数据存储（来自 h5app.owl-portfolio.com）
-- 按类别存储原始抓取内容，便于后续映射到业务表

CREATE TABLE IF NOT EXISTS h5_scraped_data (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '',
  sub_category TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  url TEXT,
  metadata JSONB DEFAULT '{}',
  source_page TEXT NOT NULL DEFAULT '',
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_h5_scraped_category ON h5_scraped_data(category);
CREATE INDEX IF NOT EXISTS idx_h5_scraped_source ON h5_scraped_data(source_page);

COMMENT ON TABLE h5_scraped_data IS '从 h5app.owl-portfolio.com 抓取的原始数据，按 首页/微课堂/组合/工具/我的 分类';

DROP TRIGGER IF EXISTS set_updated_at ON h5_scraped_data;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON h5_scraped_data FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE h5_scraped_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for h5_scraped_data" ON h5_scraped_data;
CREATE POLICY "Allow all for h5_scraped_data" ON h5_scraped_data FOR ALL USING (true) WITH CHECK (true);
