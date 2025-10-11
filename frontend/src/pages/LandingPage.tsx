import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div>
      <Navbar />
      <Hero onStart={() => nav("/login")} onAlt={() => nav("/register")} />
      <Features />
      <HowItWorks />
      <CTA onStart={() => nav("/login")} />
      <Footer />
    </div>
  );
}

function Hero({ onStart, onAlt }: { onStart: () => void; onAlt: () => void }) {
  return (
    <section style={hero.s}>
      <div style={hero.inner}>
        <div style={hero.badge}>변호사와 AI의 만남 — 신뢰와 속도</div>
        <h1 style={hero.h1}>
          복잡한 법률문제,<br/>이제 <span style={hero.grad}>한 번의 질문</span>이면 충분합니다.
        </h1>
        <p style={hero.p}>
          회원가입 후, 상황을 설명해 보세요. 필요한 문서, 절차, 유사 판례까지
          명확하게 안내합니다. 한국어/영어 중심, 다국어 확장 예정.
        </p>
        <div style={hero.btns}>
          <button style={hero.primary} onClick={onStart}>지금 시작하기</button>
          <button style={hero.secondary} onClick={onAlt}>무료로 가입</button>
        </div>
        <div style={hero.note}>* 제공 정보는 일반 안내이며, 최종 법률자문은 변호사 상담이 필요합니다.</div>
      </div>
      <div style={hero.gridLine}/>
    </section>
  );
}

function Features() {
  const items = [
    { t:"즉시 상담 흐름", d:"로그인 후 1분 내 첫 질문. 필요한 문서·절차를 단계로 안내."},
    { t:"역할 기반 권한", d:"관리자/사용자 권한 구분, 이력/데이터 안전 보관."},
    { t:"챗 인터페이스", d:"대화형으로 맥락 유지. 과거 기록과 함께 이어서 질문."},
    { t:"문서 자동화(예정)", d:"진술서·의견서 등 템플릿 자동 생성 + 편집."},
  ];
  return (
    <section style={feat.s}>
      <h2 style={feat.h2}>법률 접근성을 새롭게 디자인했습니다</h2>
      <div style={feat.grid}>
        {items.map((x, i)=>(
          <div key={i} style={feat.card}>
            <div style={feat.cardHead}>{x.t}</div>
            <div style={feat.cardBody}>{x.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n:"01", t:"질문", d:"상황을 간단히 입력하면 핵심 쟁점을 추출합니다."},
    { n:"02", t:"탐색", d:"관련 법령·판례·절차를 빠르게 정리합니다."},
    { n:"03", t:"가이드", d:"다음 단계(증빙/기관/기한)를 체크리스트로 제시합니다."},
    { n:"04", t:"연결(옵션)", d:"전문 변호사와의 상담을 이어붙일 수 있습니다."}
  ];
  return (
    <section style={how.s}>
      <h2 style={how.h2}>사용 방법</h2>
      <div style={how.row}>
        {steps.map(s=>(
          <div key={s.n} style={how.step}>
            <div style={how.no}>{s.n}</div>
            <div style={how.tt}>{s.t}</div>
            <div style={how.dd}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA({ onStart }: { onStart: () => void }) {
  return (
    <section style={cta.s}>
      <div style={cta.box}>
        <h3 style={cta.h3}>지금 바로, 법률 문제를 정리해보세요</h3>
        <p style={cta.p}>로그인하거나 가입 후 질문을 시작하면, 필요한 정보가 단계적으로 정리됩니다.</p>
        <button style={cta.btn} onClick={onStart}>로그인하고 시작</button>
      </div>
    </section>
  );
}

const hero = {
  s:{position:"relative" as const, padding:"64px 24px 48px", overflow:"hidden"},
  inner:{maxWidth:980, margin:"0 auto", textAlign:"center" as const},
  badge:{display:"inline-block", fontSize:12, padding:"8px 12px", borderRadius:999,
         border:"1px solid var(--line)", color:"var(--muted)", marginBottom:12, background:"var(--glass)"},
  h1:{fontSize:"52px", lineHeight:1.1, margin:"10px 0 14px", fontWeight:800},
  grad:{background:"linear-gradient(90deg, #61dafb, #00e676)", WebkitBackgroundClip:"text" as any, color:"transparent"},
  p:{color:"var(--muted)", maxWidth:720, margin:"0 auto 24px"},
  btns:{display:"flex", gap:12, justifyContent:"center"},
  primary:{padding:"14px 22px", borderRadius:12, border:"none", background:"var(--cta)", color:"#000", fontWeight:800, cursor:"pointer"},
  secondary:{padding:"14px 22px", borderRadius:12, border:"1px solid var(--line)", background:"transparent", color:"var(--txt)", cursor:"pointer"},
  note:{marginTop:14, color:"var(--muted)", fontSize:12},
  gridLine:{position:"absolute" as const, inset:0, background:
    "radial-gradient(1000px 300px at 50% -10%, rgba(97,218,251,.25), transparent 60%)"}
};

const feat = {
  s:{padding:"48px 24px"},
  h2:{textAlign:"center" as const, fontSize:28, marginBottom:24, fontWeight:800},
  grid:{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, maxWidth:1100, margin:"0 auto"},
  card:{background:"var(--glass)", border:"1px solid var(--line)", borderRadius:14, padding:18},
  cardHead:{fontWeight:700, marginBottom:8},
  cardBody:{color:"var(--muted)"},
};

const how = {
  s:{padding:"36px 24px 48px"},
  h2:{textAlign:"center" as const, fontSize:26, marginBottom:18, fontWeight:800},
  row:{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, maxWidth:1100, margin:"0 auto"},
  step:{border:"1px solid var(--line)", background:"var(--glass)", borderRadius:14, padding:18},
  no:{fontWeight:800, color:"var(--cta)", marginBottom:8},
  tt:{fontWeight:700, marginBottom:6},
  dd:{color:"var(--muted)"},
};

const cta = {
  s:{padding:"56px 24px 80px"},
  box:{maxWidth:880, margin:"0 auto", border:"1px solid var(--line)", borderRadius:16, padding:"28px 24px",
       background:"linear-gradient(180deg, rgba(97,218,251,.08), rgba(0,230,118,.06))"},
  h3:{fontSize:26, margin:"6px 0 10px", fontWeight:800},
  p:{color:"var(--muted)", marginBottom:14},
  btn:{padding:"14px 20px", borderRadius:12, border:"none", background:"var(--cta)", color:"#000", fontWeight:800, cursor:"pointer"}
};
