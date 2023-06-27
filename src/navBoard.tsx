interface Props {
  metadata: {
    title: string;
    subTitle: string;
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
  const { metadata, timelineCount } = Props;
  return (
    <div className="nav navResponsive pt-3">
      <div className="container">
        <div className="fixedBio d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <img
              className="profile pl-1"
              height="80"
              src="https://avatars.githubusercontent.com/u/54783062?v=4"
            />
            <div className="person pl-3">
              <h2>{metadata.title}</h2>
              <h5 className="text-secondary">{metadata.subTitle}</h5>
            </div>
          </div>
          <div className="contact text-right">
            {metadata.contacts.map((contact) => (
              <a href={contact.url}>
                <span>{contact.title}</span>
                <i className={"fa fa-"+contact.icon}></i>
              </a>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-start mt-2">
          <div className="colTitle">
            <h4 className="m-0">Skills</h4>
          </div>
          {metadata.skillCategories.map((category) => (
            <div className="colTitle">{category}</div>
          ))}
        </div>
        <a className="preSticky dateSticky" onClick={()=>{$('.mainParent').stop().animate({ scrollTop: $('.mainParent')[0].scrollHeight }, {duration: (2500+timelineCount*100), easing: 'easeOutBounce'})}}>
          <div>Scroll Down</div>
          <i className="fa fa-angle-down animateBounce2 h3"></i>
        </a>
      </div>
    </div>
  );
}

export default NavBoard;
