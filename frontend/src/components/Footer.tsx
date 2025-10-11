export default function Footer() {
  return (
    <footer style={styles.wrap}>
      <div style={styles.grid}>
        <div>
          <div style={styles.brand}>⚖️ Legal AI</div>
          <p style={styles.muted}>법률 접근성을 높이는 AI 동반자</p>
        </div>
        <div>
          <div style={styles.head}>문의</div>
          <div style={styles.muted}>support@legalai.example</div>
        </div>
        <div>
          <div style={styles.head}>정책</div>
          <div style={styles.muted}>이용약관 · 개인정보처리방침</div>
        </div>
      </div>
      <div style={styles.copy}>© 2025 Legal AI. All rights reserved.</div>
    </footer>
  );
}
const styles = {
  wrap:{borderTop:"1px solid var(--line)", marginTop:48, padding:"24px 24px 36px"},
  grid:{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16},
  brand:{fontWeight:800, marginBottom:6},
  head:{fontWeight:700, marginBottom:6},
  muted:{color:"var(--muted)"},
  copy:{marginTop:18, color:"var(--muted)", fontSize:12}
};
