import mongoose from "mongoose"

interface user {
    _id: string,
    firstname?: string,
    lastname?: string,
    email: string,
    password: string,
    phonenumber?: number,
    field?: string,
    location?: string,
    is_google: boolean,
    img_url?: string,
    about?: string,
    is_verified: boolean,
    is_blocked: boolean,
    is_admin: boolean,
    github_url: string,
    portfolio_url: string,
    isGoogle: boolean,
    percentage: number
    resume_url: string,
    skills: [string],
    qualification: string,
    experience: [{
        experiencefield: string,
        duration: number,
        responisibilites: string
    }],
    jobapplied_Count: number,
    plan_id: mongoose.Schema.Types.ObjectId,
    jobapplied_LastReset: Date,
    connections:[{
        user_id:mongoose.Schema.Types.ObjectId,
        status:boolean
    }]
}

export default user
export interface experienceData {
    experiencefield: string,
    mode: string,
    start_date: Date,
    end_date: Date,
    responisibilites: string
}
export interface reviews {
    rating_count: Number,
    review: String,
    user_id: mongoose.Schema.Types.ObjectId,
    company_id: mongoose.Schema.Types.ObjectId,
    time: Date
}