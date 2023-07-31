import "./accountModal.scss";
import Bounce from "react-reveal/Bounce";
import { useEffect, useRef, useState } from "react";
import useAuth from "hooks/useAuth";
import toast from "react-hot-toast";
import { truncateWalletString } from "utils";
import { useAccount  } from 'wagmi';
interface Props {
  showAccountModal: boolean;
  setShowAccountModal?: any;
}
const AccountModal: React.FC<Props> = ({
  showAccountModal,
  setShowAccountModal,
}) => {
  const [isStart, setIsStart] = useState(false);
  useEffect(() => {
    if (showAccountModal) {
      setTimeout(() => {
        setIsStart(true);
      }, 100);
    }
  }, [setIsStart, showAccountModal]);
  const onClose = () => {
    setIsStart(false);
    setTimeout(() => {
      setShowAccountModal(false);
    }, 800);
  };

  const { address } = useAccount();
  const inputEl = useRef<HTMLInputElement>(null);
  const clickHandle = () => {
    if (inputEl && inputEl.current) {
      navigator.clipboard.writeText(address);
      toast.success('Copied Address!');
    }
  };

  const { logout } = useAuth();
  const onDisconnect = () => {
    setIsStart(false);
    setTimeout(() => {
      setShowAccountModal(false);
      logout();
    }, 800);
  };
  return (
    <div
      className={
        showAccountModal === true ? "accountModal active" : "accountModal"
      }
    >
      <Bounce opposite when={isStart}>
        <div className="modelContent">
          <div className="connectWalletHeader">
            <h1 className="connectWalletTitle">Account</h1>
            <button className="connectModalCloseButton" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modalWraper">
            <span>
              <img src="assets/avatar.png" alt="" className="avatar" />
              <input
                className="addressInput"
                ref={inputEl}
                type="text"
                value={truncateWalletString(address) || ""}
                onChange={() => {}}
              />
              <button className="coppyAddressButton" onClick={clickHandle}>
                <i className="fas fa-copy"></i>
              </button>
            </span>
            <div className="modalBtns">
              {/* <a href={`https://opensea.io/${account}`} target="_blank" rel="noreferrer" >
                <i className="fas fa-external-link-alt"></i>VIEW ON OPENSEA
              </a> */}

              <button className="disconnect button" onClick={onDisconnect}>
                <p>Disconnect</p>
              </button>
            </div>
          </div>
        </div>
      </Bounce>
    </div>
  );
};
export default AccountModal;
