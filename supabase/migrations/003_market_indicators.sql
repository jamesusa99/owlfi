-- 市场指标（单条，后台系统设置编辑、首页展示）
CREATE TABLE IF NOT EXISTS market_indicators (
  id INT PRIMARY KEY DEFAULT 1,
  bond_equity_spread TEXT NOT NULL DEFAULT '4.40%',
  spread_status TEXT NOT NULL DEFAULT '较好',
  market_temperature TEXT NOT NULL DEFAULT '66.12°C',
  temp_status TEXT NOT NULL DEFAULT '偏热',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE market_indicators IS '市场指标，仅保留一条，首页展示';

INSERT INTO market_indicators (id, bond_equity_spread, spread_status, market_temperature, temp_status)
VALUES (1, '4.40%', '较好', '66.12°C', '偏热')
ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS set_updated_at ON market_indicators;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON market_indicators FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE market_indicators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for market_indicators" ON market_indicators;
CREATE POLICY "Allow all for market_indicators" ON market_indicators FOR ALL USING (true) WITH CHECK (true);
