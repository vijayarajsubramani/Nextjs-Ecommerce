import axios from 'axios';

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", 'jzzmdow4');
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${'dlss4eh3a'}/image/upload`, formData);
    const data = await response.data;
    imgArr.push(data.secure_url);
  }
  return imgArr;
};
