import React from "react";
import brandLogo from "../../assets/brandLogo.png";
import HomeLeft from "../../assets/HomeLeft.png";
import InputLogin from "../atoms/LoginInputField";
import Submit from "../atoms/LoginSubmit";
import google from "../../assets/google.png";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";
import apple from "../../assets/apple.png";

export default function Home() {

  return (
    <div className="bg-surface-dark w-[100vw] flex">
      <img src={brandLogo} className="absolute top-[1.17vw] left-[1.54vw] w-[6.59vw]"/>
      <img src={HomeLeft} className="w-[64.13vw]"/>

      <div className="flex flex-col justify-center px-[3vw]">
        <div className="text-w-ground text-[4.39vw] font-ptd-600">Login</div>
        <div className="text-w-ground text-[1.46vw] mt-[.73vw] mb-[.73vw] font-ptd-500 ">Email</div>
        <InputLogin type="email" name="email"/>
        <div className="text-w-ground text-[1.46vw] mt-[.73vw] mb-[.73vw] font-ptd-500">Password</div>
        <InputLogin type="password" name="password"/>
        <a href="#" className="text-secondary text-[1.02vw] mt-[1.17vw] mb-[1.61vw] font-ptd-400 underline flex justify-end">비밀번호를 잊어버리셨습니까?</a>
        <Submit value="Login" />
        <div className="text-w-ground text-[1.02vw] mt-[1.17vw] font-ptd-400 text-center">회원이 아닌가요?</div>
        <a href="/signup" className="text-secondary text-[1.02vw] mt-[.3vw] text-center font-ptd-400">지금 회원가입 하러가기</a>
        <div className="flex justify-between items-center mt-[2.93vw]">
          <div className="w-[9.22vw] h-[.07vw] bg-secondary"></div>
          <div className="text-secondary text-[1.02vw] font-ptd-400">Or SignUp With</div>
          <div className="w-[9.22vw] h-[.07vw] bg-secondary"></div>
        </div>
        <div className="flex justify-center mt-[1.46vw]">
          <a href="#"><img src={google} className="w-[2.93vw] ml-[.37vw] mr-[.37vw]"/></a>
          <a href="#"><img src={kakao} className="w-[2.93vw] ml-[.37vw] mr-[.37vw]"/></a>
          <a href="#"><img src={naver} className="w-[2.93vw] ml-[.37vw] mr-[.37vw]"/></a>
          <a href="#"><img src={apple} className="w-[2.93vw] ml-[.37vw] mr-[.37vw]"/></a>
        </div>
      </div>
    </div>
  );
}
