import { useState, useEffect } from "react";
import portfolioData from "./assets/portfolio.json";
import NavBoard from "./navBoard";
import Copyright from "./copyright";
import $ from "jquery";
import ScrollReveal from 'scrollreveal';

type Timeline = {
  [key: string]: string | number | boolean | Array<SkillTag> | Array<externalLink>;
  id: number;
  fixed: boolean;
  title: string;
  content: string;
  category: string;
  dateTag: string;
  skillTags: Array<SkillTag>;
  externalLinks: Array<externalLink>;
};

type SkillTag = {
  [key: string]: string | number | boolean;
  title: string;
  progress: number;
  sticky: boolean;
  x: number;
  y: number;
  z: number;
};

type externalLink = {
  [key: string]: string | number | boolean;
  title: string;
  icon: string;
  url: string;
};

const searchableKeys = ["title", "category", "content"];
type SearchTerm = {
  title?: string;
  category?: string;
  content?: string;
};

const App: React.FC = () => {
  const [timelines, setTimelines] = useState<Timeline[]>(
    portfolioData.timeline
  );
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({});

  const skillHeap: (string | number[])[][] = [];
  const pushSkillHeap = (skill = "x", col = 0, row = 0) => {
    if (row) { // specific row
      if (!skillHeap[col]) {
        skillHeap[col] = ["", skill];
        return 1;
      }
      skillHeap[col][row] = skill;
      return row;
    }
    if (!skillHeap[col]) {
      skillHeap[col] = ["", skill];
      return 1;
    }
    row = skillHeap[col].indexOf(skill);
    if (row != -1) return row;
    skillHeap[col].push(skill);
    return skillHeap[col].length - 1;
  }

  useEffect(() => {
    // jquery
    $(".read-more:not(.expanded)").each(function (this: HTMLElement) {
      $(this).append('<span class="trigger">+ read more</span>');
    });
    $(".read-more").click(function (this: HTMLElement) {
      $(this).addClass("expanded");
    });
    $("a[href*=http]").attr("target", "_blank");

    // sticky bounce animations
    const lastScrolled:Array<number> = [];
    const lastAnimated:Array<number> = [];
    $(".mainParent").scroll(function () {
        $(".bounceSticky").each(function (index) {
            //if(Math.abs(lastScrolled[index] - $(".skillSticky").eq(index).offset().top)<4){
            if (lastScrolled[index] == $(".bounceSticky").eq(index)?.offset()?.top) {
                if (!lastAnimated[index]) {
                    $(".colTitle").eq(parseInt($(this).attr("data-col") ?? "0")).addClass("animateShadowBottom")
                        .on("animationend", function () {
                            $(this).removeClass('animateShadowBottom');
                        });
                    $(".bounceSticky").eq(index)
                        .addClass('animateBounce')
                        .on("animationend", function () {
                            $(this).removeClass('animateBounce');
                        });
                    lastAnimated[index] = 1;
                }
            } else {
                lastScrolled[index] = $(".bounceSticky").eq(index)?.offset()?.top ?? 0;
                lastAnimated[index] = 0;
            }
        });
        //console.log(lastScrolled);
    });

    // scroll animations
    ScrollReveal().reveal('.innerContent', { container: $(".mainParent"), delay: 300, origin: 'left', distance: '30px', easing: 'ease-in'});
    ScrollReveal().reveal('.linkBadge', { container: $(".mainParent"), delay: 600, origin: 'top', distance: '30px', easing: 'ease-in', scale: 0.5});
    ScrollReveal().reveal('.categorySticky', { container: $(".mainParent"), delay: 600, origin: 'right', distance: '30px', easing: 'ease-in', scale: 0.5});
    ScrollReveal().reveal('.bounceSticky', { container: $(".mainParent"), delay: 900, origin: 'top', distance: '30px', easing: 'ease-in', scale: 0.5});
    // TODO The first contents may come one by one => increasing delay param
    
  }, [timelines]);

  const orFilterItems = (searchTerm: SearchTerm) => {
    console.log(searchTerm);
    const filtered = portfolioData.timeline.filter((item: Timeline) => {
      const matches = Object.entries(searchTerm).map(([key, value]) => {
        if (value) {
          return item[key]
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        }
        return true;
      });
      if(item.fixed) return true; // always visible
      return matches.includes(true);
    });
    setTimelines(filtered);
  };

  const fillSearchTerm = (_value: string) => {
    let _searchTerm: SearchTerm = searchTerm;
    Object.entries(searchableKeys).forEach(([, key]) => {
      _searchTerm = { ..._searchTerm, [key]: _value };
    });
    setSearchTerm(_searchTerm);
    orFilterItems(_searchTerm);
  };

  return (
    <>
      <NavBoard metaData={portfolioData.metaData} timelineCount={timelines.length}></NavBoard>

      <div className="preMainParent"></div>
      <main className="mainParent" lang="en">
        <div id="scrollUp" className="blankArea"></div>

        {timelines.map((item) => [
          <div className="contentRouter" id={item.id.toString()}></div>,
          <a
            href={"#" + item.id.toString()}
            className="preSticky sticky dateSticky"
          >
            {item.dateTag}
          </a>,
          <div className="content">
            <div className="innerContent">
              <div className="d-flex">
                <h4 className="mr-auto">{item.title}</h4>
                <a className="contentTag ml-3 preSticky skillSticky categorySticky ml-2">
                  {item.category}
                </a>
              </div>
              <div className="externalLinks">
                {item.externalLinks.map((externalLink) => (
                  <a href={externalLink.url} className="linkBadge">
                    <i className={"fa fa-" + externalLink.icon}></i>
                    <span>{externalLink.title}</span>
                  </a>
                ))}
              </div>
              <div className={"read-more "+(item.content.length>550 ? '' : 'expanded')}>
                <div className="textContent" dangerouslySetInnerHTML={{__html: item.content}}></div>
              </div>
            </div>
          </div>,
          item.skillTags.map((skillTag) => {
            let row = skillTag.y;
            if(skillTag.sticky){
              row = pushSkillHeap(skillTag.title, skillTag.x, skillTag.y);
            }
            return (
            <a
              data-col={skillTag.x.toString()}
              href={"#" + item.id.toString()}
              style={
                {
                  zIndex: (skillTag.z ?? 1) + 3, // default 4
                  "--skillColorRGB": skillTag.color,
                  "--skillScore": (skillTag.progress / 12).toString() + "vh",
                } as React.CSSProperties
              }
              className={
                " col0" +
                skillTag.x.toString() +
                " row0" +
                row.toString() +
                (skillTag.sticky && " sticky") +
                " preSticky skillSticky bounceSticky btn btn-primary-outline"
              }
            >
              {skillTag.title}
            </a>
          )}),
        ])}
        <div className="blankArea" style={{ height: 1000 }}></div>
        <div className="contentRouter" id="copyright"></div>
        <a href="#copyright" className="preSticky dateSticky">
          copyright
        </a>
        <Copyright></Copyright>
        <div className="blankArea"></div>
      </main>
      <footer className="footer navResponsive">
        <div className="container p-2">
          <div className="d-flex justify-content-between">
            <form>
              <input
                className="inputBox"
                name="query"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  fillSearchTerm(e.target.value);
                }}
              />
              <input
                className="resetButton"
                name="reset"
                type="reset"
                value="x"
                onClick={() => {
                  fillSearchTerm("");
                }}
              />
            </form>
            <div className="contact d-flex justify-content-end">
              {portfolioData.metaData.contacts.map((contact) => (
                <a href={contact.url}>
                  <span>{contact.title}</span>
                  <i className={"fa fa-"+contact.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
