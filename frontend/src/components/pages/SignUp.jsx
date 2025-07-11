import React, { useState } from "react";
import instance from '../../apis/instance.js';

export const getUserInfo = async (formData) => {
  const res = await instance.post('/users/signup', formData);
  return res.data;
}

export default function SignUp() {
  const [formDatas, setFormDatas] = useState({
    userId: '',
    password: '',
    email: '',
    name: '',
    profileImageUrl: null,
    nickname: '',
    phone: '',
    sido: '',
    sigungu: '',
    eupmyun: '',
    detailAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormDatas(prev => ({
      ...prev,
      profileImageUrl: e.target.files[0]
    }));
  };

  const submitUserInfo = async(e) => {
    e.preventDefault();

    const requiredFields = ['email', 'password', 'name', 'nickname', 'phone', 'sido', 'sigungu', 'eupmyun'];
    for (let field of requiredFields) {
      if (!formDatas[field]) {
        alert(`${field}을(를) 입력해 주세요.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("email", formDatas.email);
    formData.append("password", formDatas.password);
    formData.append("name", formDatas.name);
    formData.append("nickname", formDatas.nickname);
    formData.append("phone", formDatas.phone);
    formData.append("sido", formDatas.sido);
    formData.append("sigungu", formDatas.sigungu);
    formData.append("eupmyun", formDatas.eupmyun);
    formData.append("detailAddress", formDatas.detailAddress);

    if (formDatas.profileImageUrl) {
      formData.append("profileImageUrl", formDatas.profileImageUrl);
    }

    try {
      const result = await getUserInfo(formData);
      console.log("success", result);
    } catch (error) {
      console.log("fail", error);
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={submitUserInfo}>
        <table>
          <tbody>
            <tr>
              <td>이메일</td>
              <td><input type="email" name="email" value={formDatas.email} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td><input type="password" name="password" value={formDatas.password} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>이름</td>
              <td><input type="text" name="name" value={formDatas.name} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>프로필 이미지</td>
              <td><input type="file" name="profileImageUrl" onChange={handleFileChange} /></td>
            </tr>
            <tr>
              <td>닉네임</td>
              <td><input type="text" name="nickname" value={formDatas.nickname} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>휴대폰 번호</td>
              <td><input type="text" name="phone" value={formDatas.phone} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td rowSpan="2">주소</td>
              <td>
                <select name="sido" value={formDatas.sido} onChange={handleChange}>
                  <option value="">시도</option>
                  <option>강원도</option>
                </select>
                <select name="sigungu" value={formDatas.sigungu} onChange={handleChange}>
                  <option value="">시군구</option>
                  <option>삼척시</option>
                </select>
                <select name="eupmyun" value={formDatas.eupmyun} onChange={handleChange}>
                  <option value="">읍면동</option>
                  <option>노곡면</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><input type="text" name="detailAddress" placeholder="상세주소" value={formDatas.detailAddress} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="제출" />
      </form>
    </div>
  );
}
