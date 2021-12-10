import React from "react";
import { Modal } from "@material-ui/core";
import FollowMember from "../followMember/FollowMember";
import "./FollowModal.css";

function FollowModal({ open, handleOpen, handleClose, userArr, following }) {
  console.log({ userArr, open, following });
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div className="modalBox">
          <h3>{following ? "Following" : "Followers"}</h3>
          <div class="modalBox__memberss">
            {userArr
              ? userArr.map((el) => (
                  <FollowMember
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
export default FollowModal;
