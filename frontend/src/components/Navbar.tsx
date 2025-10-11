import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  return (
    <nav style={styles.nav}>
      <div style={styles.left} onClick={() => nav("/")}>
        <span style={styles.logo}>⚖️ Legal AI</span>
      </div>
      <div style={styles.right}>
        <Link to="/login" style={styles.link}>로그인</Link>
        <Link to="/register" style={{...styles.link, ...styles.cta}}>회원가입</Link>
      </div>
    </nav>
  );
}
const styles = {
  nav:{position:"sticky" as const, top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between",
       padding:"14px 24px", borderBottom:"1px solid var(--line)", backdropFilter:"blur(10px)", background:"rgba(14,14,16,0.5)"},
  left:{display:"flex", alignItems:"center", cursor:"pointer"},
  logo:{fontWeight:800, letterSpacing:.3, fontSize:"1.05rem"},
  right:{display:"flex", gap:"12px", alignItems:"center"},
  link:{padding:"10px 14px", color:"var(--txt)", border:"1px solid var(--line)", borderRadius:10},
  cta:{borderColor:"transparent", background:"var(--cta)", color:"#000", fontWeight:700}
};
