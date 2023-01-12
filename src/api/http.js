// // 封装请求
// import axios from 'axios'
// // 请求
// const http = axios.create({
//     // baseURL: "https://music.thedream.tech",
//     // baseURL: "http://localhost:81",
//     timeout: 6000,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
// // 请求拦截
// http.interceptors.request.use(config => {
//     //请求头设置
//     let token = ''
//     let user = JSON.parse(localStorage.getItem('user'))
//     if (user !== 'undefined' && user != null) {
//         // user = JSON.parse(user)
//         token = user.token || ''
//     }else{
//         this.$router.push({ path: '/login' })
//         this.$message.error('登录失效')
//     }
//     config.headers.Authorization = token
//     // console.log(config);
//     return config
// }, err => {
//     // console.log(err);
// })

// // 响应拦截
// http.interceptors.response.use(res => {
//     return res.data;
//     // 对响应码的处理
//     // switch (arr.data.meta.status) {
//     //     case 1000:
//     //         ElMessage({
//     //             message: arr.data.meta.msg,
//     //             type: 'success',
//     //         })
//     //         break;
//     //     case 1001:
//     //         ElMessage({
//     //             message: arr.data.meta.msg,
//     //             type: 'error',
//     //         })
//     //         break;
//     //     case 1002:
//     //         ElMessage({
//     //             message: arr.data.meta.msg,
//     //             type: 'warning',
//     //         })
//     //         break;
//     //     default:
//     //         ElMessage({
//     //             message: arr.data.meta.msg,
//     //             type: 'error',
//     //         })
//     //         break;
//     // }
//     // return arr.data.data
// }, err => {
//     // console.log(err);
// })

// export default http