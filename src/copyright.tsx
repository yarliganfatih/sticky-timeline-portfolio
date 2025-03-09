// used as a external function because of jquery render problem
function Copyright() {
  return (
    <div className="content">
      <div id="contiuneImprove" className="d-flex justify-content-between innerContent">
        <p>developed by Fatih Yarlıgan</p>
          <div className="text-center cursor-pointer" onClick={() => { $('.mainParent').stop().animate({ scrollTop: 0 }, { duration: 2500, easing: 'easeOutBounce' }) }}>
            <i className="fa fa-angle-up animateBounce2 h3"></i>
            <div>Scroll Up</div>
          </div>
      </div>
    </div>
  );
}

export default Copyright;
