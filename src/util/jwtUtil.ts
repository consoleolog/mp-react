import axios from "axios";
import cookieUtil from "./CookieUtil";



const jwtAxios = axios.create()

const refreshJWT = async (accessToken:any, refreshToken:any) => {

    const host = `http://localhost:8080/mp/refresh`
    // const host = `https://moonpool.shop/mp/refresh`
    const header = {headers:{'Authorization' : `Bearer ${accessToken}`}}
    const res = await axios.get(`${host}?refreshToken=${refreshToken}`, header)
    return res.data;
}

const beforeReq = (config:any) => {
    // console.log("before request..........")
    const memberInfo = cookieUtil.getCookie('userCookie')
    if(!memberInfo){
        // console.log("Member NOT FOUND")
        return Promise.reject(
            {response:{
                    data:
                        {error:"REQUIRE_LOGIN"}
                }
            }
        )
    }
    const {accessToken} = memberInfo
    config.headers.Authorization = `Bearer ${accessToken}`
    // console.log("before request..........end----------")
    return config
}

const requestFail = (err:any) => {
    // console.log("request error............")
    return Promise.reject(err)
}

const beforeRes = async (res:any) => {
    // console.log("before return response................")
    const memberCookieValue = await cookieUtil.getCookie('userCookie')
    // console.log(memberCookieValue)
    const data = res.data
    // console.log(data)
    if(data && data.Error === "Error_Access_Token"){
        const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken)
        //new accessToken -> refreshToken -> CookieValue
        memberCookieValue.accessToken = result.accessToken
        memberCookieValue.refreshToken = result.refreshToken
        cookieUtil.saveCookie('userCookie', JSON.stringify(memberCookieValue), 1)
        const originalRequest = res.config
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
        return axios(originalRequest);
    }
    return res
}

const responseFail = (err:any) => {
    // console.log("response fail error..............")
    return Promise.reject(err)
}

jwtAxios.interceptors.request.use(beforeReq,requestFail)
jwtAxios.interceptors.response.use(beforeRes,responseFail)

export default jwtAxios