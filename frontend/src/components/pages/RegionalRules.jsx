// src/components/pages/RegionRules.jsx

import { useState, useEffect } from "react";
import instance from "../../apis/instance";
import Header from "../templates/Header";

// API functions
export const getRegion = async (data) => {
  const res = await instance.post("/regionalRules/region", data);
  return res.data;
}

export const getRuleByAddress = async (selected) => {
  const res = await instance.post("/regionalRules/getRule", selected);
  return res.data;
};

export default function RegionalRules() {
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [eupmyunList, setEupmyunList] = useState([]);
  const [riList, setRiList] = useState([]);

  const [selectedAddr, setSelectedAddr] = useState({
    sido: "",
    sigungu: "",
    eupmyun: "",
    ri: "",
  });

  const [wasteInfo, setWasteInfo] = useState([]);
  const [isResult, setIsResult] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      const sido = await getRegion({});
      setSidoList(sido);
    };
    fetchRegions();
  }, []);

  const resetLowerLevels = (level, filtered) => {
    if (level === "ri") { return; }
    else if (level === "sido") {
      setSigunguList(filtered);
      setEupmyunList([]);
      setRiList([]);
    } else if (level === "sigungu") {
      setEupmyunList(filtered);
      setRiList([]);
    } else if (level === "eupmyun") { setRiList(filtered); }
  }

  const handleRegionChange = async (level, value) => {
    let updatedAddr = { ...selectedAddr, [level]: value };

    if (level === "sido") {
      updatedAddr = { sido: value, sigungu: "", eupmyun: "", ri: "" };
    } else if (level === "sigungu") {
      updatedAddr = { ...updatedAddr, eupmyun: "", ri: "" };
    } else if (level === "eupmyun") {
      updatedAddr = { ...updatedAddr, ri: "" };
    }

    const region = await getRegion(updatedAddr);
    console.log("region", region)
    const filtered = region.filter(name => name && name.trim() !== "");

    console.log(updatedAddr);

    resetLowerLevels(level, filtered);

    setSelectedAddr(updatedAddr);
    setIsResult(null);
    setWasteInfo([]);
  };


  const fetchRuleByAddress = async () => {
    const rules = await getRuleByAddress(selectedAddr);
    console.log(rules);

    if (!rules || rules.length === 0) {
      setWasteInfo([]);
      setIsResult(false);
    } else {
      setWasteInfo(rules);
      setIsResult(true);
    }
  };


  {/* <CustomDropdown label="시도" options={sidoList} selected={selectedAddr.sido} onSelect={(sido) => { setSelectedAddr({ sido, sigungu: "", eupmyun: "", ri: "" }); setWasteInfo([]); /> */ }
  // 시작이 대문자라 컴포넌트 함수로 인식
  const CustomDropdown = ({ label, options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-50">
        <div onClick={() => setIsOpen(!isOpen)}
          className="text-center gap-1.5 p-2 text-sm transition-all border-none bg-white text-[#202020] font-semibold cursor-pointer" style={{
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.7)",
          }}>
          {selected || label}
        </div>
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-[#81C784] rounded shadow-md max-h-60 overflow-y-auto list-none pl-0 ml-0">
            <li className="px-4 py-2 bg-gray-100 text-gray-500 cursor-default select-none" key="label">{label}</li>
            {options.map((option, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-[#E8F5E9] cursor-pointer text-[#202020] h-7"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );

  };

  const showInfo = (name, details) => {
    return (
      details && (
        <p className="text-sm mb-2">
          <strong>{name}</strong>{details?.split("\n").map((line, idx) => (
            <span key={idx}>{line}<br /></span>
          ))}
        </p>
      )
    );
  };

  const dropdownConfig = [
    { label: "시도", level: "sido", options: sidoList },
    { label: "시군구", level: "sigungu", options: sigunguList },
    { label: "읍면", level: "eupmyun", options: eupmyunList },
    { label: "리", level: "ri", options: riList }
  ];


  return (
    <div>
      <Header />
      <div className="pt-12 mb-10 mt-10">
        <div className="flex justify-center flex-wrap gap-4">
          {dropdownConfig.map(({ label, level, options }) => (
            <CustomDropdown
              key={level}
              label={label}
              options={options}
              selected={selectedAddr[level]}
              onSelect={(value) => handleRegionChange(level, value)}
            />
          ))}

          {/* 조회 버튼 */}
          <button onClick={fetchRuleByAddress} className="bg-[#264D3D] hover:bg-[#749E89] text-white px-6 py-2 rounded shadow-md transition-all border-none cursor-pointer">
            조회
          </button>
        </div>

        {/* 결과 출력 */}
        <div className="mt-12 space-y-8 px-6 max-w-4xl mx-auto">
          {isResult === false && (
            <div className="bg-[#749E89] border border-[#A5D6A7] rounded-xl shadow-lg p-8 text-center text-white space-y-3">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-lg font-bold">
                  {selectedAddr.sido} {selectedAddr.sigungu}의 쓰레기 수거 정보가 존재하지 않습니다.
                </p>
                <p className="text-sm text-[#E8F5E9]">
                  정확한 정보는 관리자에게 문의해 주세요.
                </p>
              </div>
            </div>
          )}


          {isResult === true && wasteInfo && wasteInfo.length > 0 && (
            <>
              <div className="p-0 rounded-lg max-w-lg mx-auto">
                <h2 className="font-semibold text-[#264D3D] mb-2 text-center">
                  {wasteInfo[0].sido} {wasteInfo[0].sigungu}의 쓰레기 수거 정보
                </h2>
                <p className="text-center">
                  <a
                    href={wasteInfo[0].homepage}
                    className={`text-[#202020] ${wasteInfo[0].homepage
                      ? 'hover:text-green-900 hover:underline transition-colors duration-300'
                      : 'pointer-events-none opacity-50 cursor-default'
                      }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [홈페이지에서 정보 확인하기]
                  </a>
                </p>
              </div>

              {wasteInfo
                .filter(item => !item.wasteType)
                .map((item, idx) => (
                  <div key={"noType" + idx} className="bg-[#749E89] border border-[#A5D6A7] rounded-xl shadow-lg p-8 text-center text-white font-semibold space-y-4">
                    <div className="flex flex-col items-center space-y-2">

                      <p className="text-lg">
                        <span className="font-bold text-[#C8E6C9]">{selectedAddr.sido} {selectedAddr.sigungu}</span>의 쓰레기 수거 정보가 존재하지 않습니다.
                      </p>
                      <p className="text-sm text-[#E8F5E9]">
                        더 정확한 정보는 해당 지역 홈페이지를 참고해주세요.
                      </p>

                      <a href={item.homepage}
                        className="mt-4 inline-block bg-white text-[#2E7D32] hover:bg-[#C8E6C9] hover:text-[#1B5E20] transition-colors px-4 py-2 rounded-full font-semibold shadow"
                        target="_blank" rel="noopener noreferrer">
                        [{selectedAddr.sido} {selectedAddr.sigungu} 홈페이지 바로가기]
                      </a>
                    </div>
                  </div>
                ))}



              {["GENERAL", "FOOD", "RECYCLING"].map((type) => {
                const info = wasteInfo.find((item) => item.wasteType === type);
                if (!info) return null;

                let wasteLabel = "";
                if (type === "GENERAL") wasteLabel = "일반쓰레기";
                else if (type === "FOOD") wasteLabel = "음식물쓰레기";
                else if (type === "RECYCLING") wasteLabel = "재활용쓰레기";

                return (
                  <div key={type} className="bg-[#749E89] border border-[#A5D6A7] rounded-xl shadow-lg p-6 space-y-3">
                    <h3 className="text-2xl font-bold text-center text-[#202020] mb-4">
                      {wasteLabel}
                    </h3>

                    <div className="space-y-2 text-lg leading-relaxed">
                      {showInfo("🕒 배출 시간: ", info.disposalTime)}
                      {showInfo("📅 배출 요일: ", info.disposalDays)}
                      {showInfo("🚛 수거 일시: ", info.collectionSchedule)}
                      {showInfo("📍 배출 장소: ", info.disposalLocation)}
                      {showInfo("📋 배출 방법: ", info.disposalMethod)}
                      {showInfo("💡 참고 사항: ", info.notes)}
                    </div>

                    {info.imgUrl && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">🖼️ 참고 이미지</p>
                        <img src={info.imgUrl} alt="참고 이미지" className="w-full max-h-64 object-contain rounded-lg border border-white"/>
                      </div>
                    )}
                  </div>
                );
              })}

            </>
          )}
        </div>

      </div>
    </div>
  );
}
