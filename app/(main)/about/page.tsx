'use client'

import { motion } from 'framer-motion'

const TEAM = [
  { name: '田野老师', role: '经验丰富 · 富有情怀的老乡建工作者' },
  { name: 'Greener', role: '全栈架构师（AI PUAer）' },
  { name: '丸丸', role: '用户体验交互（UI/UX）· 内容运营' },
  { name: '晓玫', role: '用户体验交互（UI/UX）· 内容运营' },
]

export default function AboutPage() {
  return (
    <div
      className="page-bg"
      style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}
    >
      <div className="max-w-[720px] mx-auto px-6 flex flex-col items-center text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="font-ui text-[11px] tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            关于我们
          </p>
          <h1
            className="font-serif mb-6"
            style={{
              fontSize: 'clamp(26px, 5vw, 38px)',
              fontWeight: 300,
              color: 'var(--text-heading)',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            爱故乡<span style={{ color: 'var(--color-wheat)' }}>驿站</span>
            ——由乡建雨（XJRain）平台驱动
          </h1>
        </motion.div>

        {/* Brand philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p
            className="font-display mb-4"
            style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontStyle: 'italic',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
            }}
          >
            From cloud to rain.
            <br />
            Virtual to earthly.
          </p>

          <p
            className="font-ui mb-4"
            style={{
              fontSize: 17,
              color: 'var(--text-secondary)',
              lineHeight: 1.9,
              textAlign: 'center',
            }}
          >
            <strong style={{ color: 'var(--text-heading)', fontWeight: 600 }}>XJRain</strong>{' '}
            是一个「雨」（Rain）平台——而不是传统意义的「云」（Cloud）平台。
            <br />
            我们致力于将 AI、数据和代码化作雨水，
            <br />
            轻轻飘落，浇灌真实的大地。
          </p>

          <p
            className="font-ui mb-4"
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.85,
              textAlign: 'center',
            }}
          >
            我们相信技术不应该只飘在云端。
            <br />
            它应该落到泥土里，长出庄稼、手艺和人情。
            <br />
            连接土地与人，重建城乡之间的情感纽带。
          </p>
        </motion.div>

        {/* QR Code — C位 */}
        <motion.div
          className="my-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="p-5 rounded-2xl inline-block"
            style={{
              background: 'rgba(45,42,38,0.5)',
              border: '1px solid rgba(201,169,110,0.2)',
              boxShadow: '0 0 40px rgba(201,169,110,0.06)',
            }}
          >
            <img
              src="/images/qr-xjrain.png"
              alt="xjrain QR Code"
              className="w-[200px] h-[200px] md:w-[240px] md:h-[240px]"
            />
          </div>
          <p
            className="font-ui mt-4"
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            扫码访问
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: 14,
              color: 'var(--color-wheat)',
              letterSpacing: '0.03em',
              marginTop: 4,
            }}
          >
            xjrain.greenerai.top
          </p>
        </motion.div>

        {/* Team */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <p
            className="font-ui text-xs tracking-[0.15em] uppercase mb-5"
            style={{ color: 'var(--text-muted)' }}
          >
            团队
          </p>
          {/* 田野老师 — 独立一行 */}
            <div
              className="py-3 px-6 rounded-xl w-full max-w-[360px] mx-auto mb-3"
              style={{
                background: 'rgba(45,42,38,0.4)',
                border: '1px solid rgba(245,241,234,0.06)',
              }}
            >
              <p className="font-ui" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)' }}>
                {TEAM[0].name}
              </p>
              <p className="font-ui text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {TEAM[0].role}
              </p>
            </div>

            {/* Greener、丸丸、晓玫 — 桌面横向并排，移动端纵向 */}
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              {TEAM.slice(1).map((member) => (
                <div
                  key={member.name}
                  className="flex-1 py-3 px-4 rounded-xl md:max-w-[220px]"
                  style={{
                    background: 'rgba(45,42,38,0.4)',
                    border: '1px solid rgba(245,241,234,0.06)',
                  }}
                >
                  <p className="font-ui" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)' }}>
                    {member.name}
                  </p>
                  <p className="font-ui text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="font-ui text-xs mt-12"
          style={{ color: 'var(--text-dim)', lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          基于屏南数智乡建黑客松实地验证
          <br />
          让每一行代码都落进泥土
        </motion.p>
      </div>
    </div>
  )
}
