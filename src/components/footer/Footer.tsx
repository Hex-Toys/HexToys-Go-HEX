import { HashLink } from 'react-router-hash-link'
import './footer.scss'

export default function Footer() {
    return (
        <div className="footer">
            <div className="footerContent" data-aos="fade-up">
                <div className="wrapper">
                    <div className="left">
                        <div className="links">
                            <a href="https://azteccrypto.xyz/home/" target="_blank"rel="noreferrer">Home</a> 
                            <a href="https://azteccrypto.xyz/info/" target="_blank"rel="noreferrer">Info</a> 
                            <a href="https://azteccrypto.xyz/team/" target="_blank"rel="noreferrer">Team</a>
                            <a href="https://azteccrypto.xyz/news/" target="_blank"rel="noreferrer">News</a> 
                            <a href="https://azteccrypto.xyz/buyandsell/" target="_blank"rel="noreferrer">Buy/Sell</a> 
                            <a href="https://staking.azteccrypto.xyz/" target="_blank"rel="noreferrer">Staking</a> 
                            <a href="https://azteccrypto.xyz/white-paper/" target="_blank"rel="noreferrer">White Paper</a> 
                        </div>
                        
                    </div>
                    <div className="right">
                        <HashLink to="/" ><img src="assets/logo.png" alt="" /></HashLink>

                        <div className="socialLinks">
                            <a href="https://www.facebook.com/profile.php?id=100088880297462" target="_blank"rel="noreferrer">
                                <i className="fab fa-facebook"></i>
                            </a> 
                            <a href="https://www.instagram.com/azteccryptocurrencyrgv/" target="_blank"rel="noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a> 

                            <a href="https://twitter.com/azteccryptorgv" target="_blank"rel="noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a> 
                        </div>
                    </div>
                </div>
                
                <span>Copyright 2023 <a href="https://azteccrypto.xyz/" target="_blank"rel="noreferrer">Aztec Crypto</a> | Developed by <a href="https://rgvwebsitedesign.com/" target="_blank"rel="noreferrer">RGV WEB DESIGN</a></span>
            </div>
           
        </div>
    )
}
 