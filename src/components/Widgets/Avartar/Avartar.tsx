import { useEffect,useContext, useState } from "react";
import "./avartar.scss";
import { useHistory } from "react-router";
import ThemeContext from 'context/ThemeContext';
interface PropsType {
  img_url: string;
  border ?:boolean
  type ?: string
  url ?:string
  size? :string
}

const Avartar = ({img_url, border, type = 'image', url, size = 'lg'}:PropsType) => {
  const { theme } = useContext(ThemeContext)
  const history = useHistory();
  const goToSearchPage = () => {
    history.push(`/${url}`);
  };

  useEffect(() => {
    // console.log(`searchTxt: ${searchTxt}`);
  }, [])
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`avartar bg_color_${theme} ${size} ` + (border ? `border_${theme}`: '')} onClick={goToSearchPage}>
        <div className={`video_img_card border_${theme}`}>
          {type === 'image' ? 
              <img src={img_url || '/assets/profile.png'} className="image" alt='' onLoad={()=>setIsLoading(false)} style={{opacity : isLoading ? 0 : 1}}/>:
              <video className="videoEmbed" autoPlay={true} loop muted={true} onLoadedData={()=>setIsLoading(false)} style={{opacity : isLoading ? 0:1}}>
                <source src={img_url} type="video/mp4"/>
              </video>
          }
          {isLoading && <img src={'/assets/hextoysloading.gif'} alt=""  className="img_cover"/>}
          
        </div>
    </div>
  );
};

export default Avartar;
