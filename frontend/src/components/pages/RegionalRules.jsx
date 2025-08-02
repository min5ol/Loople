import { useState, useEffect } from "react";
import instance from "../../apis/instance";
import { useNavigate } from "react-router-dom";

// API functions
export const getSido = async () => {
  const res = await instance.get("/regionalRules/sido");
  return res.data;
};

export const getSigungu = async (sido) => {
  const res = await instance.get("/regionalRules/sigungu", { params: { sido } });
  return res.data;
};

export const getEupmyun = async (sigungu) => {
  const res = await instance.get("/regionalRules/eupmyun", { params: { sigungu } });
  return res.data;
};

export const getRi = async (eupmyun) => {
  const res = await instance.get("/regionalRules/ri", { params: { eupmyun } });
  return res.data;
};

export const getRuleByAddress = async (selected) => {
  const res = await instance.post("/regionalRules/getRule", selected);
  return res.data;
};

export default function RegionalRules() {
  const navigate = useNavigate();

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
  // null: 아직 조회 안함, true: 결과 있음, false: 결과 없음(null 또는 빈 배열)


  useEffect(() => {
    const fetchSido = async () => {
      const sido = await getSido();
      setSidoList(sido);
    };
    fetchSido();
  }, []);

  const fetchSigungu = async (sido) => {
    const sigungu = await getSigungu(sido);
    const filtered = sigungu.filter((item) => item && item.trim() !== "");
    setSigunguList(filtered.length > 0 ? filtered : [" "]);
  };

  const fetchEupmyun = async (sigungu) => {
    const eupmyun = await getEupmyun(sigungu);
    const filtered = eupmyun.filter((item) => item && item.trim() !== "");
    setEupmyunList(filtered.length > 0 ? filtered : [" "]);
  };

  const fetchRi = async (eupmyun) => {
    const ri = await getRi(eupmyun);
    const filtered = ri.filter((item) => item && item.trim() !== "");
    setRiList(filtered.length > 0 ? filtered : [" "]);
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
          className="bg-[#F6F6F6] border-2 border-[#4CAF50] text-[#202020] rounded px-4 py-2 shadow-lg cursor-pointer select-none h-7">
          {selected || label}
        </div>
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-[#81C784] rounded shadow-md max-h-60 overflow-y-auto list-none pl-0 ml-0">
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

  return (
    <div className="mb-10 mt-10">
      <button onClick={() => navigate("/looplehome")} className="text-sm text-[#264D3D] font-medium hover:underline">
        home
      </button>

      <div className="flex justify-center flex-wrap gap-4">
        {/* 시도 */}
        <CustomDropdown
          label="시도"
          options={sidoList}
          selected={selectedAddr.sido}
          onSelect={(sido) => {
            setSelectedAddr({ sido, sigungu: "", eupmyun: "", ri: "" });
            fetchSigungu(sido);
            setWasteInfo([]);
            setSigunguList([]);
            setEupmyunList([]);
            setRiList([]);
            setIsResult(null);
          }}
        />

        {/* 시군구 */}
        <CustomDropdown
          label="시군구"
          options={sigunguList}
          selected={selectedAddr.sigungu}
          onSelect={(sigungu) => {
            setSelectedAddr((prev) => ({ ...prev, sigungu, eupmyun: "", ri: "" }));
            fetchEupmyun(sigungu);
            setEupmyunList([]);
            setRiList([]);
            setIsResult(null);
          }}
        />

        {/* 읍면 */}
        <CustomDropdown
          label="읍면"
          options={eupmyunList}
          selected={selectedAddr.eupmyun}
          onSelect={(eupmyun) => {
            setSelectedAddr((prev) => ({ ...prev, eupmyun, ri: "" }));
            fetchRi(eupmyun);
            setRiList([]);
            setIsResult(null);
          }}
        />

        {/* 리 */}
        <CustomDropdown
          label="리"
          options={riList}
          selected={selectedAddr.ri}
          onSelect={(ri) => {
            setSelectedAddr((prev) => ({ ...prev, ri }));
            setIsResult(null);
          }}
        />

        {/* 조회 버튼 */}
        <button onClick={fetchRuleByAddress} className="bg-[#3C9A5F] hover:bg-[#264D3D] text-white px-6 py-2 rounded shadow-md transition-all border-none cursor-pointer">
          조회
        </button>
      </div>

      {/* 결과 출력 */}
      <div className="mt-12 space-y-8 px-6 max-w-4xl mx-auto">
        {isResult === false && (
          <div className="bg-[#FEF7E2] border border-[#81C784] rounded-lg shadow p-6 text-center text-[#264D3D] font-semibold">
            <p>{selectedAddr.sido} {selectedAddr.sigungu}의 쓰레기 수거 정보가 존재하지 않습니다.</p>
            <p>관리자에게 문의해 주세요.</p>
          </div>
        )}

        {isResult === true && wasteInfo && wasteInfo.length > 0 && (
          <>
            <h2 className="font-semibold text-[#264D3D] mb-4 text-center">
              {wasteInfo[0].sido} {wasteInfo[0].sigungu}의 쓰레기 수거 정보
            </h2>

            {wasteInfo
              .filter(item => !item.wasteType)
              .map((item, idx) => (
                <div key={"noType" + idx} className="bg-[#FEF7E2] border border-[#81C784] rounded-lg shadow p-6 text-center text-[#264D3D] font-semibold">
                  <p>
                    {selectedAddr.sido} {selectedAddr.sigungu}의 쓰레기 수거 정보가 존재하지 않습니다.
                  </p>
                  <p>정확한 정보는 홈페이지에서 확인 바랍니다.</p>
                  <a href={item.homepage} className="inline-block text-[#202020] hover:text-green-900 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    [{selectedAddr.sido} {selectedAddr.sigungu} 홈페이지 바로가기]
                  </a>
                </div>
              ))}


            {["GENERAL", "FOOD", "RECYCLING"].map((type) => {
              const info = wasteInfo.find((item) => item.wasteType === type);
              if (!info) return null;

              let wasteLabel = "";
              if (type === "GENERAL") wasteLabel = "일반쓰레기";
              else if (type === "FOOD") wasteLabel = "음식물쓰레기";
              else if (type === "RECYCLING") wasteLabel = "재활용쓰레기";

              {/* 🕒 배출시간 📅 배출요일 🚛 수거일시 📍 배출장소 📋 배출방법 🖼️ 참고이미지 💡 참고사항 */ }
              return (
                <div key={type} className="bg-[#FEF7E2] border border-[#81C784] rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-[#264D3D] mb-4">
                    <span className="text-[#3C9A5F]">{wasteLabel}</span>
                  </h3>

                  {showInfo("🕒 배출 시간: ", info.disposalTime)}
                  {showInfo("📅 배출 요일: ", info.disposalDays)}
                  {showInfo("🚛 수거 일시: ", info.collectionSchedule)}
                  {showInfo("📍 배출 장소: ", info.disposalLocation)}
                  {showInfo("📋 배출 방법", info.disposalMethod)}
                  {showInfo("💡 참고 사항: ", info.notes)}

                  {info.imgUrl && (
                    <p>
                      <strong>참고 이미지</strong>
                      <img src={info.imgUrl} alt="참고 이미지" className="max-w-full h-auto" />
                    </p>
                  )}

                </div>
              )
            })

            }
          </>
        )}
      </div>

    </div>
  );
}
