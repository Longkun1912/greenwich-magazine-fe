import "../css/Forbidden.scss";

const UnAuthorizedPage = () => {
  return (
    <div className="container">
      <div className="gandalf">
        <div className="fireball"></div>
        <div className="skirt"></div>
        <div className="sleeves"></div>
        <div className="shoulders">
          <div className="hand left"></div>
          <div className="hand right"></div>
        </div>
        <div className="head">
          <div className="hair"></div>
          <div className="beard"></div>
        </div>
      </div>
      <div className="message">
        <h1 style={{ color: "black" }}>Unauthorized - You Shall Not Pass</h1>
        <p>
          Uh oh, this way is blocked!
          <br />
          Maybe you go to the wrong page? Or your role is not authorized to
          access this page.
        </p>
      </div>
    </div>
  );
};

export default UnAuthorizedPage;
