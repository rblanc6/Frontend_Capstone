import { useState } from "react";
import axios from "axios";

function ImageUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [res, setRes] = useState({});
  const handleSelectFile = (e) => setFile(e.target.files[0]);
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("my_file", file);
      const res = await axios.post(
        "http://localhost:3000/api/recipes/upload",
        data
      );
      setRes(res.data);
      if (res.data && res.data.secure_url) {
        onUploadSuccess(res.data.secure_url);
        setUploadSuccess(true);
      }
    } catch (error) {
      alert(error.message);
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <label htmlFor="file" className="btn-grey">
        {" "}
        select file
      </label>
      <div className="input-group mb-3">
        <input 
        id="file"
        type="file"
        onChange={handleSelectFile}
        multiple={false}
        className="form-control" 
         />
        {!uploadSuccess && file && (
        <>
          <button onClick={handleUpload} className="btn btn-secondary">
            {loading ? "uploading..." : "Upload"}
          </button>
        </>
      )}
      </div>
      {uploadSuccess && (
        <div className="alert alert-success" role="alert">
          File uploaded successfully!
        </div>
      )}
    </div>
  );
}
export default ImageUpload;
