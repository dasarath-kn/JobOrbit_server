import bcrypt from 'bcrypt'

class HashPassword {

    async hashPassword(password:string){
        try {
            
            const hashedPassword = await bcrypt.hash(password,10)
            return hashedPassword
        } catch (error) {
            console.error(error);
            
        }
        
    }

    async comparePassword(password:string,hashed:string){
        try {
            
            const comparedPassword = await bcrypt.compare(password,hashed)
            return comparedPassword

        } catch (error) {
            console.error(error);
            
        }
    }
}

export default HashPassword