# Supabase 表结构

本目录包含猫头鹰基金研究院运维后台所需的 Supabase 表结构。

## 执行方式

### 方式一：Supabase Dashboard

1. 打开 [Supabase](https://supabase.com) 项目
2. 左侧选择 **SQL Editor**
3. 新建 Query，复制 `migrations/001_owlfi_admin_tables.sql` 全文并执行

### 方式二：Supabase CLI

```bash
# 若已安装 Supabase CLI 并 link 项目
supabase db push
# 或
supabase migration up
```

## 表说明

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `admin_users` | 用户管理 | id, phone, nickname, reg_time, orders_count, status |
| `courses` | 课程 | id, title, type, duration, tag, thumbnail, desc, video_bvid |
| `lessons` | 课时（关联 courses） | id, course_id, sort_order, title, content, video_bvid |
| `news` | 资讯 | id, title, summary, status, publish_time |
| `orders` | 订单 | id, user_display, type, amount, status, order_time |
| `forum_posts` | 论坛帖子 | id, title, author, content, replies_count, status, publish_time |

所有表均包含 `created_at`、`updated_at`，且已启用 RLS。当前策略为允许所有操作，生产环境建议改为仅允许 service_role 或指定角色。
