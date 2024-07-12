interface ICloudinary{
    uploadImage(image:any,folderName:string):Promise<string>;
}
export default ICloudinary