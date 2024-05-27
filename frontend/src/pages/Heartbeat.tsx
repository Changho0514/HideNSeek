import { useSelector } from "react-redux";
import { useEffect } from "react";
import { heartbeat } from "../api/auth";

export default function Heartbeat() {
  // member-service에 주기적으로 heartbeat 날린다.
  const meName = useSelector(
    (state: any) => state.reduxFlag.userSlice.userNickname
  );
  let interval: any = null;
  useEffect(() => {
    if (interval) return;
    if (!meName) return;
    interval = setInterval(() => {
      heartbeat(meName).catch((e) => {
        if (e.response.status >= 400) {
          console.log('로그아웃되었습니다.')
        //   alert("로그아웃되었습니다. 다시 로그인 해 주세요");
        //   window.location.href = "/";
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      interval = null;
    };
  }, [meName]);

  return <></>;
}
