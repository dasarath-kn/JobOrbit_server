interface company {
    _id:string,
    companyname:string,
    email:string,
    password:string,
    phonenumber:number,
    industry:string,
    state:string,
    city:string,
    address:string,
    about:string,
    is_google:boolean,
    img_url?:string
    is_blocked:boolean,
    website_url:string,
    is_verified:boolean,
    admin_verified:boolean,
    document_url:string,
    percentage:number
 
}

export default company
