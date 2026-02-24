-- 猫头鹰基金研究院 - 运维后台数据表
-- 在 Supabase SQL Editor 中执行此文件，或使用 supabase db push

-- 1. 用户管理 (admin_users)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL DEFAULT '',
  nickname TEXT NOT NULL DEFAULT '',
  reg_time DATE NOT NULL DEFAULT CURRENT_DATE,
  orders_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '正常' CHECK (status IN ('正常', '禁用')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS '后台用户管理';

-- 2. 课程 (courses)
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '视频' CHECK (type IN ('视频', '图文')),
  duration TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT '入门' CHECK (tag IN ('入门', '进阶', '高级')),
  thumbnail TEXT NOT NULL DEFAULT '📖',
  "desc" TEXT NOT NULL DEFAULT '',
  video_bvid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE courses IS '投顾学院课程';

-- 3. 课时 (lessons，关联课程)
CREATE TABLE IF NOT EXISTS lessons (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  video_bvid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
COMMENT ON TABLE lessons IS '课程课时';

-- 4. 资讯 (news)
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '草稿' CHECK (status IN ('已发布', '草稿')),
  publish_time DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE news IS '资讯文章';

-- 5. 订单 (orders)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_display TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '申购' CHECK (type IN ('申购', '赎回')),
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '处理中' CHECK (status IN ('已完成', '处理中', '已取消')),
  order_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS '申购/赎回订单';

-- 6. 论坛帖子 (forum_posts)
CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  replies_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '正常' CHECK (status IN ('正常', '置顶', '已删除')),
  publish_time DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE forum_posts IS '论坛帖子';

-- 自动更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表添加 updated_at 触发器（重复执行时先删除再创建）
DROP TRIGGER IF EXISTS set_updated_at ON admin_users;
DROP TRIGGER IF EXISTS set_updated_at ON courses;
DROP TRIGGER IF EXISTS set_updated_at ON lessons;
DROP TRIGGER IF EXISTS set_updated_at ON news;
DROP TRIGGER IF EXISTS set_updated_at ON orders;
DROP TRIGGER IF EXISTS set_updated_at ON forum_posts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 启用 RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- 策略：允许所有操作（上线建议改为仅 service_role 或已认证管理员）
DROP POLICY IF EXISTS "Allow all for admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow all for courses" ON courses;
DROP POLICY IF EXISTS "Allow all for lessons" ON lessons;
DROP POLICY IF EXISTS "Allow all for news" ON news;
DROP POLICY IF EXISTS "Allow all for orders" ON orders;
DROP POLICY IF EXISTS "Allow all for forum_posts" ON forum_posts;
CREATE POLICY "Allow all for admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for courses" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for lessons" ON lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for forum_posts" ON forum_posts FOR ALL USING (true) WITH CHECK (true);
