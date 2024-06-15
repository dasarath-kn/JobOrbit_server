interface admin {
    _id:string,
    email:string,
    password:string,
    phonenumber:number,
    industry:string,
    city:string,
    address:string,
    state:string,
    about:string,
    websiteurl?:string,
    is_blocked:boolean,
    is_verified:boolean

}
export default admin