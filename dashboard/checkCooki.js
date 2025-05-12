let src = "https://b-soft-s3.xyz.s3.ap-south-1.amazonaws.com/1740426114758-product-1740426114755-winall-3.png"
const result =  src.replace(
    'https://b-soft-s3.xyz.s3.ap-south-1.amazonaws.com',
    'https://s3.ap-south-1.amazonaws.com/b-soft-s3.xyz'
);



console.log(result);
