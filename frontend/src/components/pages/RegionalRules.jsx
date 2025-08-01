import { useState, useEffect } from "react";
import instance from "../../apis/instance";
import { useNavigate } from "react-router-dom";

export const getSido = async () => {
  const res = await instance.get("/regionalRules/sido");
  return res.data;
}

export const getSigungu = async (sido) => {
  const res = await instance.get("/regionalRules/sigungu", { params: { sido } });
  return res.data;
}

export const getEupmyun = async (sigungu) => {
  const res = await instance.get("/regionalRules/eupmyun", { params: { sigungu } });
  return res.data;
}

export const getRi = async (eupmyun) => {
  const res = await instance.get("/regionalRules/ri", { params: { eupmyun } });
  return res.data;
}

export const getRuleByAddress = async (selected) => {
  const res = await instance.post("/regionalRules/getRule", selected);
  return res.data;
}

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
    ri: ""
  });
  const [wasteInfo, setWasteInfo] = useState([]);


  useEffect(() => {
    const fetchSido = async () => {
      const sido = await getSido();
      setSidoList(sido);
    };

    fetchSido();
  }, []);

  const fetchSigungu = async (sido) => {
    const sigungu = await getSigungu(sido);
    const filtered = sigungu.filter(item => item && item.trim() !== "");
    setSigunguList(filtered);
  }

  const fetchEupmyun = async (sigungu) => {
    const eupmyun = await getEupmyun(sigungu);
    const filtered = eupmyun.filter(item => item && item.trim() !== "");
    setEupmyunList(filtered);
  }

  const fetchRi = async (eupmyun) => {
    const ri = await getRi(eupmyun);
    const filtered = ri.filter(item => item && item.trim() !== "");
    setRiList(filtered);
  }

  const fetchRuleByAddress = async () => {
    const rules = await getRuleByAddress(selectedAddr);
    console.log(rules);
    setWasteInfo(rules);
  }


  return (
    <div>
      <button onClick={() => navigate("/looplehome")} className="text-sm text-[#264D3D] font-medium hover:underline">home</button>

<div className="flex justify-center flex-wrap gap-4 mt-10">
  {/* 시도 */}
  <select
    onChange={(e) => {
      const sido = e.target.value;
      setSelectedAddr((prev) => ({ ...prev, sido, sigungu: "", eupmyun: "", ri: "" }));
      fetchSigungu(sido);
      setWasteInfo([]);
      setSigunguList([]);
      setEupmyunList([]);
      setRiList([]);
    }}
    className="bg-[#F6F6F6] border border-[#81C784] text-[#202020] rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#81C784]"
  >
    <option value="">시도</option>
    {sidoList.map((sido, idx) => (
      <option key={idx} value={sido}>{sido}</option>
    ))}
  </select>

  {/* 시군구 */}
  <select
    onChange={(e) => {
      const sigungu = e.target.value;
      setSelectedAddr((prev) => ({ ...prev, sigungu }));
      fetchEupmyun(sigungu);
    }}
    className="bg-[#F6F6F6] border border-[#81C784] text-[#202020] rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#81C784]"
  >
    <option value="">시군구</option>
    {sigunguList.map((sigungu, idx) => (
      <option key={idx} value={sigungu}>{sigungu}</option>
    ))}
  </select>

  {/* 읍면 */}
  <select
    onChange={(e) => {
      const eupmyun = e.target.value;
      setSelectedAddr((prev) => ({ ...prev, eupmyun }));
      fetchRi(eupmyun);
    }}
    className="bg-[#F6F6F6] border border-[#81C784] text-[#202020] rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#81C784]"
  >
    <option value="">읍면</option>
    {eupmyunList.map((eupmyun, idx) => (
      <option key={idx} value={eupmyun}>{eupmyun}</option>
    ))}
  </select>

  {/* 리 */}
  <select
    onChange={(e) => {
      const ri = e.target.value;
      setSelectedAddr((prev) => ({ ...prev, ri }))
    }}
    className="bg-[#F6F6F6] border border-[#81C784] text-[#202020] rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#81C784]"
  >
    <option value="">리</option>
    {riList.map((ri, idx) => (
      <option key={idx} value={ri}>{ri}</option>
    ))}
  </select>

  {/* 조회 버튼 */}
  <button
    onClick={fetchRuleByAddress}
    className="bg-[#3C9A5F] hover:bg-[#264D3D] text-white px-6 py-2 rounded shadow-md transition-all border-none"
  >
    조회
  </button>
</div>


      <div className="mt-12 space-y-8 px-6 max-w-4xl mx-auto">
        {/* 🕒 배출시간 📅 배출요일 🚛 수거일시 📍 배출장소 📋 배출방법 🖼️ 참고이미지 💡 참고사항 */}
        {wasteInfo.map((info, idx) => {
          let waste;
          if (info.wasteType === "GENERAL") waste = "일반쓰레기";
          else if (info.wasteType === "FOOD") waste = "음식물쓰레기";
          else if (info.wasteType === "RECYCLING") waste = "재활용쓰레기";
          else if (info.wasteType === null) return null;

          return (
            <div key={idx} className="bg-[#FEF7E2] border border-[#81C784] rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-[#264D3D] mb-4">
                {info.sido} {info.sigungu}의 <span className="text-[#3C9A5F]">{waste}</span> 정보
              </h3>

              <p className="text-sm mb-2"><strong>🕒 배출 시간:</strong> {info.disposalTime}</p>
              <p className="text-sm mb-2"><strong>📅 배출 요일:</strong> {info.disposalDays}</p>

              <div className="text-sm mb-2">
                <strong>🚛 수거 일시:</strong><br />
                {info.collectionSchedule?.split("\n").map((line, idx) => (
                  <span key={idx}>{line}<br /></span>
                ))}
              </div>

              <p className="text-sm mb-2"><strong>📍 배출 장소:</strong> {info.disposalLocation}</p>

              <div className="text-sm mb-2">
                <strong>📋 배출 방법:</strong><br />
                {info.disposalMethod}
              </div>

              {info.imgUrl && (
                <div className="mt-4">
                  <strong className="text-sm">🖼️ 참고 이미지</strong>
                  <img src={info.imgUrl} alt="규칙 이미지" className="mt-2 rounded border border-[#749E89] max-w-full h-auto" />
                </div>
              )}
            </div>
          );
        })}
      </div>


    </div>
  );

}



// import { useState } from "react";

// export default function CustomDropdown({ options, selected, setSelected }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative inline-block w-40">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full border border-green-400 rounded p-2 text-left bg-white"
//       >
//         {selected || "선택하세요"}
//       </button>
//       {open && (
//         <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-green-400 rounded bg-white shadow-lg">
//           {options.map((option, idx) => (
//             <li
//               key={idx}
//               onClick={() => {
//                 setSelected(option);
//                 setOpen(false);
//               }}
//               className="cursor-pointer px-3 py-2 hover:bg-green-100"
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
