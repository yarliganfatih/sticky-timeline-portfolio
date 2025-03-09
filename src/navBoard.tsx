interface Props {
  metaData: {
    title: string;
    subTitle: string;
    imgUrl: string;
    contacts: Array<ContactItem>;
    skillCategories: Array<string>;
  };
  timelineCount: number;
}

type ContactItem = {
  title: string;
  icon: string;
  url: string;
};

function NavBoard(Props: Props) {
  const { metaData, timelineCount } = Props;

  let toggleNavBoard = () => {
    document.getElementsByTagName("body")[0].classList.toggle("hiddenNavBoard");
    document.getElementsByClassName("navContainer")[0].classList.toggle("d-none");
    document.getElementsByClassName("navToggle")[0].classList.toggle("fa-angle-up");
    document.getElementsByClassName("navToggle")[0].classList.toggle("fa-angle-down");
  }
  return (
    <div className="nav navResponsive">
      <div className="navContainer container left">
        <div className="d-flex justify-content-start mt-2">
          <div className="colTitle">
            <h4 className="m-0">Skills</h4>
          </div>
          {metaData.skillCategories.map((category) => (
            <div className="colTitle">{category}</div>
          ))}
        </div>
        <a className="preSticky dateSticky cursor-pointer" onClick={()=>{$('.mainParent').stop().animate({ scrollTop: $('.mainParent')[0].scrollHeight }, {duration: (2500+timelineCount*100), easing: 'easeOutBounce'})}}>
          <div>Scroll Down</div>
          <i className="fa fa-angle-down animateBounce2 h3"></i>
        </a>
        <div className="fixedBio d-flex justify-content-start">
          <img
            className="profile pl-1"
            height="80"
            src={metaData.imgUrl}
          />
          <div className="person pl-3">
            <h2>{metaData.title}</h2>
            <h5 className="text-secondary">{metaData.subTitle}</h5>
          </div>
        </div>
      </div>
      <div className="right"></div>
      <i onClick={toggleNavBoard} className="navToggle cursor-pointer fa fa-angle-up h2"></i>
    </div>
  );
}

export default NavBoard;
