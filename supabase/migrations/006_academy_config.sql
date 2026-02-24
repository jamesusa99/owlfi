-- 投顾学院分类配置：知识领域、认证体系（课程关联用）
CREATE TABLE IF NOT EXISTS academy_config (
  id INT PRIMARY KEY DEFAULT 1,
  knowledge_domains JSONB NOT NULL DEFAULT '[]',
  certification_dimensions JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE academy_config IS '投顾学院分类：知识领域与认证体系选项，课程关联时从下拉选择';

INSERT INTO academy_config (id, knowledge_domains, certification_dimensions)
VALUES (
  1,
  '["资产配置","定投实战","客户经营","宏观研判"]'::jsonb,
  '["初级投顾必修","资深投顾进阶"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS set_updated_at ON academy_config;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON academy_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE academy_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for academy_config" ON academy_config;
CREATE POLICY "Allow all for academy_config" ON academy_config FOR ALL USING (true) WITH CHECK (true);
