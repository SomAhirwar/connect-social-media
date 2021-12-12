import React from "react";
import { Modal } from "@material-ui/core";
import PopUpMember from "../popUpMember/PopUpMember";
import "./PopUpModal.css";

function PopUpModal({ open, handleOpen, handleClose, userArr, title }) {
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div className="modalBox">
          <h3>{title}</h3>
          <div class="modalBox__members">
            {userArr
              ? userArr.map((el) => (
                  <PopUpMember
                    username={el.username}
                    profileImg={el.profileImg}
                  />
                ))
              : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default PopUpModal;
