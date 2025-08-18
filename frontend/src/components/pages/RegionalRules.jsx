// src/components/pages/RegionRules.jsx

import { useState, useEffect } from "react";
import instance from "../../apis/instance";
import Header from "../templates/Header";

// #20583e #6e9b72 #f0c85a #C8E6C9

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
  const [openDropdown, setOpenDropdown] = useState(null); // null, "sido", "sigungu", ...

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
    const filtered = region.filter(name => name && name.trim() !== "");

    resetLowerLevels(level, filtered);

    setSelectedAddr(updatedAddr);
    setIsResult(null);
    setWasteInfo([]);
  };


  const fetchRuleByAddress = async () => {
    const rules = await getRuleByAddress(selectedAddr);

    if (!rules || rules.length === 0) {
      setWasteInfo([]);
      setIsResult(false);
    } else {
      setWasteInfo(rules);
      setIsResult(true);
    }
  };


  const CustomDropdown = ({ label, options, selected, isOpen, onToggle, onSelect }) => {
    return (
      <div className="relative w-50">
        <div
          onClick={onToggle}
          className={`text-center gap-1.5 p-2 text-sm transition-all font-semibold cursor-pointer rounded border border-[#6e9b72] ${selected ? "bg-[#C8E6C9] bg-opacity-50" : "bg-white"}`}
          style={{
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.7)",
          }}
        >
          {selected || label}
        </div>
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-[#6e9b72] rounded shadow-md max-h-60 overflow-y-auto list-none pl-0 ml-0">
            <li className="px-4 py-2 bg-[#f0c85a] text-white cursor-default select-none font-semibold" key="label">{label}</li>
            {options.map((option, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-[#f0c85a] hover:text-white cursor-pointer text-[#202020] h-7"
                onClick={() => onSelect(option)}
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
        <p className="text-sm mb-2 text-[#202020]">
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

    <div className="pt-20 pb-12">
      {/* 선택 바 */}
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="
            w-full rounded-2xl p-4 md:p-5
            bg-white/85 backdrop-blur-md
            ring-1 ring-black/5
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
            flex flex-wrap items-center gap-3 md:gap-4 justify-center
          "
        >
          {dropdownConfig.map(({ label, level, options }) => (
            <CustomDropdown
              key={level}
              label={label}
              options={options}
              selected={selectedAddr[level]}
              isOpen={openDropdown === level}
              onToggle={() =>
                setOpenDropdown(openDropdown === level ? null : level)
              }
              onSelect={(value) => {
                handleRegionChange(level, value);
                setOpenDropdown(null); // 선택하면 닫기
              }}
            />

          ))}

          {/* 조회 버튼 */}

          <button
            onClick={fetchRuleByAddress}
            className="
              h-10 px-5 rounded-full
              bg-brand-600 text-white text-sm font-ptd-600
              shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_10px_rgba(0,0,0,0.10)]
              hover:bg-brand-500 transition
              focus:outline-none focus:ring-4 focus:ring-brand-300
            "
          >
            조회
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="mt-10 max-w-4xl mx-auto px-6 space-y-8">
        {/* 결과 없음 */}
        {isResult === false && (
          <div
            className="
              rounded-2xl p-8 text-center
              bg-white/85 backdrop-blur-md
              ring-1 ring-black/5
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
            "
          >
            <p className="text-lg md:text-xl font-ptd-700 text-brand-ink">
              {selectedAddr.sido} {selectedAddr.sigungu}의 수거 정보가 없습니다.
            </p>
            <p className="mt-2 text-sm text-brand-ink/70">
              정확한 정보는 지자체 홈페이지나 관리자에게 문의해 주세요.
            </p>
          </div>
        )}

        {/* 결과 있음 */}
        {isResult === true && wasteInfo?.length > 0 && (
          <>
            {/* 헤더 */}
            <div
              className="
                rounded-2xl p-6 text-center
                bg-white/85 backdrop-blur-md
                ring-1 ring-black/5
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
                max-w-xl mx-auto
              "
            >
              <h2 className="font-ptd-700 text-brand-ink mb-2">
                {wasteInfo[0].sido} {wasteInfo[0].sigungu}의 쓰레기 수거 정보
              </h2>
              <a
                href={wasteInfo[0].homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-brand-ink text-sm ${
                  wasteInfo[0].homepage
                    ? 'hover:underline hover:text-brand-600'
                    : 'pointer-events-none opacity-50'
                }`}
              >
                [홈페이지에서 정보 확인하기]
              </a>
            </div>

            {/* 유형 미지정 안내 카드 */}
            {wasteInfo
              .filter((item) => !item.wasteType)
              .map((item, idx) => (
                <div
                  key={`noType-${idx}`}
                  className="
                    rounded-2xl p-7 text-center
                    bg-brand-50
                    ring-1 ring-black/5
                    shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.08)]
                  "
                >
                  <p className="text-brand-ink">
                    <span className="font-ptd-700">
                      {selectedAddr.sido} {selectedAddr.sigungu}
                    </span>
                    의 상세 수거 정보가 존재하지 않습니다.
                  </p>
                                        <p className="text-base text-[#f0c85a]">
                        더 정확한 정보는 해당 지역 홈페이지를 참고해주세요.
                      </p>
                  <a
                    href={item.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center mt-3 h-10 px-4 rounded-full bg-white text-brand-ink ring-1 ring-black/10 hover:bg-brand-100 transition text-sm"
                  >
                    [{selectedAddr.sido} {selectedAddr.sigungu} 홈페이지 바로가기]
                  </a>
                    </div>
                  </div>
                ))}

            {/* 유형별 카드 */}
            {['GENERAL', 'FOOD', 'RECYCLING'].map((type) => {
              const info = wasteInfo.find((w) => w.wasteType === type);
              if (!info) return null;

              const label =
                type === 'GENERAL' ? '일반쓰레기' : type === 'FOOD' ? '음식물쓰레기' : '재활용쓰레기';

              return (
                <div
                  key={type}
                  className="
                    rounded-2xl p-6
                    bg-white/90
                    ring-1 ring-black/5
                    shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
                  "
                >
                  <h3 className="text-xl font-ptd-700 text-brand-ink text-center mb-4">
                    {label}
                  </h3>

                  <div className="space-y-2 text-sm leading-relaxed text-brand-ink">
                    {showInfo('🕒 배출 시간: ', info.disposalTime)}
                    {showInfo('📅 배출 요일: ', info.disposalDays)}
                    {showInfo('🚛 수거 일시: ', info.collectionSchedule)}
                    {showInfo('📍 배출 장소: ', info.disposalLocation)}
                    {showInfo('📋 배출 방법: ', info.disposalMethod)}
                    {showInfo('💡 참고 사항: ', info.notes)}
                  </div>

                  {info.imgUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-ptd-600 text-brand-ink mb-2">🖼️ 참고 이미지</p>
                      <img
                        src={info.imgUrl}
                        alt="참고 이미지"
                        className="w-full max-h-64 object-contain rounded-xl ring-1 ring-brand-300"
                      />
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
