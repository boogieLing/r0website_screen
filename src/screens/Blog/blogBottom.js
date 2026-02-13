import S from "./blogBottom.module.less";
import sideLoginStyle from "@/components/sideLogin/sideLogin.module.less";
import backIconImg from "@/components/sideLogin/backIcon.png";
import thinking from "@/static/pic/thinking.png";
import coffee_cat from "@/static/pic/coffee_cat.png";
import {ShowR0} from "@/components/r0/showR0";
import {useEffect, useState} from "react";

export const BlogBottom = ({props, children, isMobile = false, isRightSidebarOpen = false, isImmersive = false}) => {
    const [mobileLeftOpen, setMobileLeftOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) {
            setMobileLeftOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile && isRightSidebarOpen) {
            setMobileLeftOpen(false);
        }
    }, [isMobile, isRightSidebarOpen]);

    useEffect(() => {
        if (isMobile && isImmersive) {
            setMobileLeftOpen(false);
        }
    }, [isMobile, isImmersive]);

    if (isMobile) {
        return <>
            {mobileLeftOpen && (
                <div
                    className={S.mobileLeftBackdrop}
                    onClick={() => setMobileLeftOpen(false)}
                />
            )}
            {!isRightSidebarOpen && !isImmersive && (
                <button
                    type="button"
                    className={`${S.mobileLeftToggleBtn} ${mobileLeftOpen ? S.mobileLeftToggleBtnOpen : ''}`}
                    onClick={() => setMobileLeftOpen((prev) => !prev)}
                    aria-expanded={mobileLeftOpen}
                    aria-label={mobileLeftOpen ? 'close left sidebar' : 'open left sidebar'}
                >
                    <span className={S.mobileLeftToggleIcon}>{mobileLeftOpen ? '←' : '☷'}</span>
                </button>
            )}
            <aside className={`${S.mobileLeftSidebar} ${mobileLeftOpen ? S.mobileLeftSidebarOpen : ''}`}>
                <div className={S.mobileLeftSidebarHeader}>
                    <span>NAV</span>
                </div>
                <div className={S.mobileLeftContent}>
                    <ul className={`${S.navigationBar} ${S.mobileLeftNavigationBar}`}>
                        <li className={S.navigation}>
                            <div className={S.nIconBox}><img src={thinking} alt=""/></div>
                            <span className={S.nTitle}>Thinking</span>
                        </li>
                        <li className={S.navigation}>
                            <div className={S.nIconBox}><img src={coffee_cat} alt="" className={S.longImg}/></div>
                            <span className={S.nTitle}>More</span>
                        </li>
                    </ul>
                    <div className={S.mobileLeftCategoryWrap}>
                        {children}
                    </div>
                </div>
            </aside>
        </>
    }

    return <>
        <div className={S.blogBottomBox}>
        {!isMobile && (
            <div
                className={sideLoginStyle.backBtn}
                style={{
                    bottom: "50px"
                }}
            >
                <div className={sideLoginStyle.backIcon}>
                    <img src={backIconImg} alt=""/>
                </div>
                <div className={sideLoginStyle.backText}/>
            </div>
        )}
        <ul className={S.navigationBar}>
            <li className={S.navigation}>
                <div className={S.nIconBox}><img src={thinking} alt=""/></div>
                <span className={S.nTitle}>Thinking</span>
            </li>
            <li className={S.navigation}>
                <div className={S.nIconBox}><img src={coffee_cat} alt="" className={S.longImg}/></div>
                <span className={S.nTitle}>More</span>
            </li>
            {!isMobile && (
                <ShowR0 style={{
                    position: "absolute",
                    left: "120%",
                    bottom: "3px",
                    marginRight:"30px",
                }}/>
            )}
        </ul>
        {children}
    </div>
    </>
}
