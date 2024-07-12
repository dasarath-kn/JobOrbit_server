interface user{
    _id:string,
    firstname?:string,
    lastname?:string,
    email:string,
    password:string,
    phonenumber?:number,
    field?:string,
    location?:string,
    is_google:boolean,
    img_url?:string,
    about?:string,
    is_verified:boolean,
    is_blocked:boolean,
    is_admin:boolean,
    github_url:string,
    portfolio_url:string,
    isGoogle:boolean,
    resume_url:string,
    skills:[string],
    qualification:string
    experience:[object]


}

export default user