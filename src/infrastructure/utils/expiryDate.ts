const getExpiryDate =async(monthsToAdd:number)=> {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.setMonth(currentDate.getMonth() + monthsToAdd));
    return expiryDate;
  }
 export default getExpiryDate