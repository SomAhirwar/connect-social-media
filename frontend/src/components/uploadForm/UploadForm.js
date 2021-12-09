import React from "react";
import axios from "axios";
import "./UploadForm.css";

function UploadForm({ uploadFormRef, setPosts }) {
  const [image, setImage] = React.useState(null);
  const [caption, setCaption] = React.useState("");

  async function onUpload(event) {
    event.preventDefault();
    const uploadFormData = new FormData();
    uploadFormData.append("image", image);
    uploadFormData.append("caption", caption);
    const post = await axios.post("./posts", uploadFormData);
    event.target.children[0].children[1].value = "";
    event.target.children[1].children[1].value = "";
    setPosts((prev) => [post.data.data.post, ...prev]);
    uploadFormRef.current.style.display = "none";
  }

  return (
    <form className="uploadForm" onSubmit={onUpload} ref={uploadFormRef}>
      <label className="uploadForm__label">
        <span>Image</span>
        <input
          type="file"
          required
          onChange={(event) => setImage(event.target.files[0])}
          name="image"
        />
      </label>
      <label className="uploadForm__label">
        <span>Caption</span>
        <textarea
          name="caption"
          onChange={(event) => setCaption(event.target.value)}
        ></textarea>
      </label>

      <button className="uploadForm__button">Upload</button>
    </form>
  );
}

export default UploadForm;
