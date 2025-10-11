import { useContext, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user === null) {
      navigate("/login");
    }
  }, [auth?.user, navigate]); // ✅ 핵심 수정

  if (!auth?.user) {
    return <p>로딩 중...</p>;
  }

  return children;
}
