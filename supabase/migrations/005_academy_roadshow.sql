-- 投顾学院体系化 + 路演日历
-- 执行前请确保 001 已执行（courses/lessons 存在）

-- 1. 讲师库
CREATE TABLE IF NOT EXISTS instructors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE instructors IS '投顾学院讲师库';

-- 2. 系列课（父级，下挂多门课程）
CREATE TABLE IF NOT EXISTS course_series (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  "desc" TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE course_series IS '系列课，下挂多门课程';

-- 3. 课程表扩展列（保留原字段，新增以下）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
    ALTER TABLE courses ADD COLUMN instructor_id BIGINT REFERENCES instructors(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'cover_url') THEN
    ALTER TABLE courses ADD COLUMN cover_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'knowledge_domain') THEN
    ALTER TABLE courses ADD COLUMN knowledge_domain TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'certification_dimension') THEN
    ALTER TABLE courses ADD COLUMN certification_dimension TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'series_id') THEN
    ALTER TABLE courses ADD COLUMN series_id BIGINT REFERENCES course_series(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'difficulty') THEN
    ALTER TABLE courses ADD COLUMN difficulty TEXT NOT NULL DEFAULT '初级' CHECK (difficulty IN ('初级', '中级', '高级'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'pdf_url') THEN
    ALTER TABLE courses ADD COLUMN pdf_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'visibility') THEN
    ALTER TABLE courses ADD COLUMN visibility TEXT NOT NULL DEFAULT '全部' CHECK (visibility IN ('全部', '试听', '会员', '白名单'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_series_id ON courses(series_id);

-- 4. 路演日历 - 活动场次
CREATE TABLE IF NOT EXISTS roadshow_events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT '预热中' CHECK (status IN ('预热中', '直播中', '回放中', '已结束')),
  external_url TEXT,
  h5_config JSONB DEFAULT '{}',
  reservation_enabled BOOLEAN NOT NULL DEFAULT true,
  reservation_base_count INT NOT NULL DEFAULT 0,
  reservation_real_count INT NOT NULL DEFAULT 0,
  replay_url TEXT,
  materials JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE roadshow_events IS '路演日历场次：时间轴、预约、回放、资料关联';

CREATE INDEX IF NOT EXISTS idx_roadshow_events_start_time ON roadshow_events(start_time);

-- 触发器
DROP TRIGGER IF EXISTS set_updated_at ON instructors;
DROP TRIGGER IF EXISTS set_updated_at ON course_series;
DROP TRIGGER IF EXISTS set_updated_at ON roadshow_events;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON course_series FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON roadshow_events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadshow_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for instructors" ON instructors;
DROP POLICY IF EXISTS "Allow all for course_series" ON course_series;
DROP POLICY IF EXISTS "Allow all for roadshow_events" ON roadshow_events;
CREATE POLICY "Allow all for instructors" ON instructors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for course_series" ON course_series FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for roadshow_events" ON roadshow_events FOR ALL USING (true) WITH CHECK (true);
