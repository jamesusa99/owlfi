-- 路演场次扩展：主题、内容、主讲人、海报、地点等
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS topic TEXT NOT NULL DEFAULT '';
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS "content" TEXT NOT NULL DEFAULT '';
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS speaker TEXT NOT NULL DEFAULT '';
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
ALTER TABLE roadshow_events ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN roadshow_events.topic IS '路演主题/副标题';
COMMENT ON COLUMN roadshow_events.content IS '路演内容详情';
COMMENT ON COLUMN roadshow_events.speaker IS '主讲人/嘉宾';
COMMENT ON COLUMN roadshow_events.poster_url IS '海报图链接（建议16:9）';
COMMENT ON COLUMN roadshow_events.location IS '举办地点（线上/线下地址）';
COMMENT ON COLUMN roadshow_events.summary IS '简要描述（列表摘要用）';
