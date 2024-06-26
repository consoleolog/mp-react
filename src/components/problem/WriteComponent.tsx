import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {BlackBg, CustomBanner, CustomBannerAside, CustomBannerBox} from "../../Global.style";
import {useDispatch, useSelector} from "react-redux";
import {changeIsModalOpenFalse, changeIsModalOpenTrue} from "../../store/store";
import {Button, ConfigProvider, message} from "antd";
import {TinyColor} from "@ctrl/tinycolor";
import {ProblemParamTypes} from "../../types/ProblemTypes";
import {RootState} from "../../index";
import problemService from "../../service/ProblemService";
import memberRepository from "../../repository/MemberRepository";

function WriteComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isModalOpen = useSelector((state:RootState) => state.isModalOpen);
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category");
    const [messageApi, contextHolder] = message.useMessage();
    const writerId = memberRepository.getUserId()
    const quizList: any[] = []
    const answerList: any[] = []
    const [quiz, setQuiz] = useState<any>([])
    const [answer, setAnswer] = useState<any>([])
    const error = (content:string) => {
        messageApi.open({
            type: 'error',
            content: `${content}`,
            duration : 1,
        });
    };
    const initState = {
        title : "",
        price : 0,
        description : "",
        category : category,
        level : "normal",
        answer : 0,
        writerId : writerId
    }
    const [problemParam, setProblemParam] = useState<ProblemParamTypes>(initState)
    const handleChange = (e:ChangeEvent<any>)=>{
        problemParam[e.target.name] = e.target.value;
        setProblemParam({...problemParam});
    }
    useEffect(() => {
        const loginCheck = memberRepository.getLoginCheck()
        if(!loginCheck){
            alert("로그인이 필요한 서비스입니다")
            navigate(`../${category}/1`)
        }
    }, []);
    const handleClick = ()=>{
        problemService.register(problemParam,quiz,answer).then((response)=>{
            console.log(response)
            if(response === "제목을 확인해주세요!"){
                error(response)
            } else if (response === "가격은 음수일수 없습니다!"){
                error(response)
            } else if (response === "문제 사진을 확인해주세요! 사진은 최소 한장은 입력해야합니다!"){
                error(response)
            } else if ( response === "답지 사진을 확인해주세요!"){
                error(response)
            } else {
                setProblemParam({
                    title : "",
                    price : 0,
                    description : "",
                    category : category,
                    level : "normal",
                    answer : 0,
                    writerId : writerId,
                })
                navigate(`/problems/${response}/1`)
            }
        }).catch((e)=>{
            console.log(e)
            error("문제 등록 중 오류가 발생했습니다")
        })
    }

    return (
        <>
            <CustomBannerBox>
                {contextHolder}
                <CustomBanner>
                    <Link to={"/"}><small>HOME</small></Link><br/><br/><br/>
                    <p style={{fontSize: "25px"}}>문제 등록하기</p>
                </CustomBanner>
                <CustomBannerAside/>
            </CustomBannerBox>
            <FormBox>
                <FormContainer>
                    <p>문제 제목</p><br/>
                    <WriteBasicInput name={"title"} onChange={handleChange} required={true}/>
                    <br/><br/><br/>
                    <p>과목 선택</p><br/>
                    <WriteBasicSelect name={"category"} defaultValue={category == null ? "korean" : category}
                                      onChange={handleChange}>
                        <option value="korean">국어</option>
                        <option value="math">수학</option>
                        <option value="english">영어</option>
                        <option value="science">과학 탐구</option>
                        <option value="social">사회 탐구</option>
                    </WriteBasicSelect>
                    <br/><br/><br/>
                    <p>난이도</p><br/>
                    <WriteBasicSelect name={"level"} defaultValue={"normal"} onChange={handleChange}>
                        <option value="easy">쉬움</option>
                        <option value="normal">보통</option>
                        <option value="hard">어려움</option>
                    </WriteBasicSelect>
                    <br/><br/><br/>
                    <p>가격(C)</p><br/>
                    <WriteBasicInput type={"number"} name={"price"} onChange={handleChange} required={true}/>
                    <br/><br/><br/>
                    <p>문제 설명</p><br/>
                    <WriteBasicInput name={"description"} onChange={handleChange} required={true}/>
                    <br/><br/><br/>
                    <p>문제 이미지</p><br/>
                    <WriteBasicInput accept={"image/*"} multiple={true} onChange={async (e:any)=>{
                        quizList.push(e.currentTarget.files[0])
                        setQuiz(quizList)

                    }} type={"file"}/>
                    <br/><br/><br/>
                    <p>문제 정답</p><br/>
                    <WriteBasicInput name={"answer"} onChange={handleChange} required={true}/>
                    <br/><br/><br/>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                    colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                    colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                    lineWidth: 0,
                                },
                            },
                        }}
                    >
                        <Button type="primary" size="large" onClick={() => {
                            dispatch(changeIsModalOpenTrue())
                        }} style={{width: "300px", height: "60px", padding: "0px 30px", marginTop: "30px"}}>
                            등록
                        </Button>
                    </ConfigProvider>
                </FormContainer>
            </FormBox>
            <AsideBox/>
            {
                isModalOpen ?
                    <BlackBg>
                        <UploadModalBox>
                            <AnswerImgInputLabel htmlFor={"answerImg"}>
                                <p>이미지 업로드 (클릭)</p>
                            </AnswerImgInputLabel>
                            <AnswerImgInputBtn onClick={handleClick}>진짜 등록</AnswerImgInputBtn>

                            <CancelBtn onClick={() => {
                                dispatch(changeIsModalOpenFalse())
                            }}>취소</CancelBtn>
                            <input style={{visibility:"hidden"}} id={"answerImg"} multiple={true} accept={"image/*"} onChange={ async (e: any) => {
                                answerList.push(e.currentTarget.files[0])
                                setAnswer(answerList)
                            }} type="file" />
                        </UploadModalBox>
                    </BlackBg> : <></>
            }
        </>
    );
}

export const CancelBtn = styled.button`
    width: 100%;
    height: 68px;
    border: none;
    color: #fff;
    margin-top: -100px;
    background-color: rgb(93, 93, 93);
    cursor: pointer;

    &:hover {
        background-color: rgb(66, 66, 66);
    }
`
export const AnswerImgInputLabel = styled.label`
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 120px;
    color: #838383;
    font-weight: 600;
    font-size: 25px;
    cursor: pointer;
`
export const AnswerImgInputBtn = styled.button`
    width: 100%;
    height: 65px;
    border: none;
    color: #fff;
    margin-top: -60px;
    background-color: rgb(236,88,81);
    cursor: pointer;
    &:hover {
        background-color: rgb(223, 79, 73);
    }
`
export const UploadModalBox = styled.div`
    padding: 50px 0 0 0 ;
    width: 400px;
    height: 200px;
    background-color: #fff;
    margin: 150px auto;
    border-radius: 5px;
`
const FormBox = styled.div`
    width: 70%;
    height: 100%;
    background-color: #fff;
    float: left;
`
const AsideBox = styled.aside`
    width: 30%;
    height: 100%;
    background-color: #fff;
    float: right;
`
const FormContainer = styled.div`
    width: 90%;
    height: 100%;
    border: solid 1px rgb(250, 250, 250);
    margin: 10px auto;
    padding: 15px 20px;
    font-size: 16px;
    &:focus {
        border:  solid 1px rgb(229,229,229);
        outline: none;
    }
`
export const WriteBasicInput = styled.input`
    width: 50%;
    height: 20px;
    min-width: 300px;
    padding: 15px 20px;
    font-size: 16px;
    border: solid 1px rgb(229,229,229);
    &:focus {
        border:  solid 1px rgb(229,229,229);
        outline: none;
    }
`

export const WriteBasicSelect = styled.select`
    width: 53%;
    height: 50px;
    min-width: 340px;
    padding: 0 20px;
    font-size: 16px;
    border: solid 1px rgb(229,229,229);
`
const WriteBasicImgDiv = styled.div`
    width: 50%;
    height: 180px;
    min-width: 300px;
    border: solid 1px rgb(229,229,229);
    text-align: center;
`
export const WriteBasicImgLabel = styled.label`
    width: 500px;
    height: 20px;
    padding: 10px 50px;
    border-radius: 10px;
    background-color: #252525;
    top: 30px;
    color: #fff;
    cursor: pointer;
    &:hover {
        background-color: #424242;
    }
`
const colors1 = ['#6253E1', '#04BEFE'];
const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());
export default WriteComponent;
// export async function action({request,params}){
//     const data = await request.formData();
//
// }