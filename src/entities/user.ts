interface user{
    _id:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    phonenumber:number,
    field:string,
    location:string,
    about:string,
    is_blocked:boolean,
    github_url:string,
    portfolio_url:string,
    resume_url:string,
    skills:[string],
    qualification:[string]
    experience:[object],


}

export default user