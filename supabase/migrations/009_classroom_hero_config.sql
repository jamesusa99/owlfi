-- 投顾学院页面：顶部轮播配置
ALTER TABLE home_classroom_config ADD COLUMN IF NOT EXISTS hero_series_id BIGINT REFERENCES course_series(id) ON DELETE SET NULL;
ALTER TABLE home_classroom_config ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT '年度投研课';
COMMENT ON COLUMN home_classroom_config.hero_series_id IS '轮播展示的系列课 ID，空则取系列课列表第一条';
COMMENT ON COLUMN home_classroom_config.hero_title IS '轮播标题（无系列时显示）';
