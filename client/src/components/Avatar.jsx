import PropTypes from 'prop-types';
import { FaUserAlt } from 'react-icons/fa';

const Avatar = ({userId,name,imageUrl,width,height}) => {

   let avatarName = "";

   if(name!==undefined && name[0]!==undefined){
      const splitName = name[0].split(" ");
      console.log(splitName)
      if(splitName.length>1){
         avatarName = splitName[0][0]+splitName[1][0]
      }else{
         avatarName = splitName[0][0]
      }
   }
   const bgColor = [
      'bg-slate-200',
      'bg-teal-200',
      'bg-red-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-gray-200',
      'bg-cyan-200',
      'bg-sky-200',
      'bg-blue-200',
   ]

   const randomNumber = Math.floor(Math.random()*5);
   console.log(randomNumber);

  return (
    <div className='text-slate-800 overflow-hidden rounded-full font-bold ' style={{width:width + "px",height:height + "px"}}>
         {
            imageUrl ? (
               <img src={imageUrl} width={width} height={height} alt=""  className="overflow-hidden rounded-full"/>
            )
            :(
               name ? 
                  <div style={{width:width + "px",height:height + "px"}} className={`overflow-hidden font-bold rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                     {avatarName.toUpperCase()}
                  </div>
                  :
                  <FaUserAlt size={width}/>
            )
         }
    </div>
  )
}

Avatar.propTypes = {
   userId:PropTypes.number,
   name:PropTypes.string,
   imageUrl:PropTypes.string,
   width:PropTypes.string,
   height:PropTypes.string
}

export default Avatar