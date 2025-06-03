import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Dropdown, Nav, NavItem, Navbar, Overlay, Popover } from 'react-bootstrap';
import { g, fetchWrapper, helpers } from '../../common';
import { logEvent, realtimeUpdate, toWorker } from '../util';
import html2canvas from '../../vendor/html2canvas.js';
import type { Option } from '../../common/types';
import { IMAGES } from '../../common/images.types'

type TopMenuToggleProps = {
    long: string;
    onClick?: (e: React.MouseEvent) => void;
    openId?: string;
    short: string;
};

const TopMenuToggle: React.FC<TopMenuToggleProps> = ({ long, onClick, openId, short }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (openId !== undefined && openId !== long && onClick) {
            onClick(e);
        }
    };

    return (
        <a
            className="nav-item"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            <span className="hidden-sm">{long} <b className="caret" /></span>
            <span className="visible-sm">{short} <b className="caret" /></span>
        </a>
    );
};

type TopMenuDropdownProps = {
    children: React.ReactNode;
    long: string;
    short: string;
    openId?: string;
    onToggle: (id: string) => void;
};

const TopMenuDropdown: React.FC<TopMenuDropdownProps> = ({ children, long, short, openId, onToggle }) => {
    return (
        <Dropdown
            as="li"
            className="dropdown nav-item-wrapper"
            id={`top-menu-${long.toLowerCase()}`}
            show={openId === long}
            onToggle={() => onToggle(long)}
        >
            <Dropdown.Toggle as={TopMenuToggle} long={long} short={short} openId={openId} />
            <Dropdown.Menu>
                <div className="visible-sm dropdown-header">{long}</div>
                {children}
            </Dropdown.Menu>
        </Dropdown>
    );
};

const handleScreenshotClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const contentElTemp = document.getElementById("screenshot-league") || document.getElementById("screenshot-nonleague");
    if (!contentElTemp) {
        throw new Error('Missing DOM element #screenshot-league or #screenshot-nonleague');
    }
    const contentEl = contentElTemp;

    // Add watermark
    const watermark = document.createElement("div");
    const navbarBrands = document.getElementsByClassName("navbar-brand");
    if (navbarBrands.length === 0 || !navbarBrands[0].parentNode) {
        return;
    }
    const parentNode = navbarBrands[0].parentNode as HTMLElement;
    watermark.innerHTML = `<nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header">${parentNode.innerHTML}</div><p class="navbar-text navbar-right" style="color: #000; font-weight: bold"></p></div></nav>`;
    contentEl.insertBefore(watermark, contentEl.firstChild);
    contentEl.style.padding = "8px";

    // Add notifications
    const notifications = document.getElementsByClassName('notification-container')[0]?.cloneNode(true) as HTMLElement;
    if (notifications) {
        notifications.classList.remove('notification-container');
        for (let i = 0; i < notifications.childNodes.length; i++) {
            const el = notifications.childNodes[0] as HTMLElement;
            if (el.classList && typeof el.classList.remove === 'function') {
                el.classList.remove('notification-fadein');
            }
        }
        contentEl.appendChild(notifications);
    }

    try {
        const canvas = await html2canvas(contentEl, {
            background: "#fff"
        });

        // Remove watermark
        contentEl.removeChild(watermark);
        contentEl.style.padding = "";

        // Remove notifications
        if (notifications) {
            contentEl.removeChild(notifications);
        }

        logEvent({
            type: 'screenshot',
            text: `Uploading your screenshot to Imgur...`,
            saveToDb: false,
            showNotification: true,
            persistent: false,
            extraClass: 'notification-primary',
        });

        const data = await fetchWrapper({
            url: 'https://imgur-apiv3.p.mashape.com/3/image',
            method: 'POST',
            headers: {
                Authorization: "Client-ID c2593243d3ea679",
                "X-Mashape-Key": "H6XlGK0RRnmshCkkElumAWvWjiBLp1ItTOBjsncst1BaYKMS8H",
            },
            data: {
                image: canvas.toDataURL().split(',')[1],
            },
        });

        if (data.data.error) {
            throw new Error(data.data.error.message);
        }

        logEvent({
            type: 'screenshot',
            text: `<a href="http://imgur.com/${data.data.id}" target="_blank">Click here to view your screenshot.</a>`,
            saveToDb: false,
            showNotification: true,
            persistent: true,
            extraClass: 'notification-primary',
        });
    } catch (err) {
        console.error(err);
        let errorMsg = "Error saving screenshot.";
        if (err instanceof Error) {
            errorMsg = `Error saving screenshot. Error message from Imgur: "${err.message}"`;
        }
        logEvent({
            type: 'error',
            text: errorMsg,
            saveToDb: false,
        });
    }
};

const handleToolsClick = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    await toWorker(`actions.toolsMenu.${id}`);
    if (id === 'resetDb') {
        window.location.reload();
    }
};

type DropdownLinksProps = {
    bothSplits: boolean;
    godMode: boolean;
    gameType: number;
    lid?: number;
};

const DropdownLinks: React.FC<DropdownLinksProps> = ({ bothSplits, godMode, gameType, lid }) => {
    const [openId, setOpenId] = useState<string | undefined>();

    const handleTopMenuToggle = (id: string) => {
        setOpenId(id === openId ? undefined : id);
    };

    return (
        <Nav className="nav navbar-nav" style={{marginRight: '0px'}}>
            {lid !== undefined && (
                <NavItem as="a" href={helpers.leagueUrl([])}>
                    <span className="hidden-xs"><span className="glyphicon glyphicon-home" /></span>
                    <span className="visible-xs toggle-responsive-menu">
                        <span className="glyphicon glyphicon-home" style={{marginRight: '5px'}} />League Dashboard
                    </span>
                </NavItem>
            )}
            {lid !== undefined && (
                <TopMenuDropdown long="League" short="L" openId={openId} onToggle={handleTopMenuToggle}>
                    <Dropdown.Item href={helpers.leagueUrl(['standings'])}>Standings</Dropdown.Item>
                    {bothSplits && <Dropdown.Item href={helpers.leagueUrl(['playoffs2'])}>Spring Playoffs</Dropdown.Item>}
                    <Dropdown.Item href={helpers.leagueUrl(['playoffs'])}>Summer Playoffs</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['league_finances'])}>Finances</Dropdown.Item>
                    {bothSplits && <Dropdown.Item href={helpers.leagueUrl(['history_all_MSI'])}>Spring History</Dropdown.Item>}
                    <Dropdown.Item href={helpers.leagueUrl(['history_all'])}>Summer History</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['power_rankings'])}>Power Rankings</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['transactions', 'all'])}>Transactions</Dropdown.Item>
                </TopMenuDropdown>
            )}
            {lid !== undefined && (
                <TopMenuDropdown long="Team" short="T" openId={openId} onToggle={handleTopMenuToggle}>
                    <Dropdown.Item href={helpers.leagueUrl(['roster'])}>Roster</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['schedule'])}>Schedule</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['team_finances'])}>Finances</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['team_history'])}>History</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['transactions'])}>Transactions</Dropdown.Item>
                </TopMenuDropdown>
            )}
            {lid !== undefined && (
                <TopMenuDropdown long="Players" short="P" openId={openId} onToggle={handleTopMenuToggle}>
                    <Dropdown.Item href={helpers.leagueUrl(['free_agents'])}>Free Agents</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['trade'])}>Trade</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['trading_block'])}>Trading Block</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['draft_summary'])}>Prospects</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['watch_list'])}>Watch List</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['hall_of_fame'])}>Hall of Fame</Dropdown.Item>
                </TopMenuDropdown>
            )}
            {lid !== undefined && (
                <TopMenuDropdown long="Stats" short="S" openId={openId} onToggle={handleTopMenuToggle}>
                    <Dropdown.Item href={helpers.leagueUrl(['game_log'])}>Game Log</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['leaders'])}>League Leaders</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['player_ratings'])}>Player Ratings</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['player_stats'])}>Player Stats</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['team_stats'])}>Team Stats</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['champion_basic'])}>Champion Basic</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['champion_stats'])}>Champion Stats</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['player_feats'])}>Statistical Feats</Dropdown.Item>
                </TopMenuDropdown>
            )}
            <TopMenuDropdown long="Tools" short="X" openId={openId} onToggle={handleTopMenuToggle}>
                <Dropdown.Item href="/account">Achievements</Dropdown.Item>
                {lid !== undefined && <Dropdown.Item onClick={e => handleToolsClick('autoPlaySeasons', e)}>Auto Play Seasons</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['customize_player'])} className="god-mode-menu">Create A Player</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['customize_team'])} className="god-mode-menu">Create A Team</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['delete_old_data'])}>Delete Old Data</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['edit_team_info'])} className="god-mode-menu">Edit Team Info</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['edit_champion_info'])} className="god-mode-menu">Edit Champion Info</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['edit_champion_patch'])} className="god-mode-menu">Edit Champion Patch</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['event_log'])}>Event Log</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['export_league'])}>Export League</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['export_stats'])}>Export Stats</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['fantasy_draft'])}>Fantasy Draft</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['god_mode'])}>God Mode</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['multi_team_mode'])} className="god-mode-menu">Multi Team Mode</Dropdown.Item>}
                {lid !== undefined && godMode && <Dropdown.Item href={helpers.leagueUrl(['new_team'])} className="god-mode-menu">Switch Team</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item href={helpers.leagueUrl(['options'])}>Options</Dropdown.Item>}
                <Dropdown.Item onClick={handleScreenshotClick}><span className="glyphicon glyphicon-camera" /> Screenshot</Dropdown.Item>
                {lid !== undefined && <li className="divider" />}
                <li role="presentation" className="dropdown-header">Use at your own risk!</li>
                {lid !== undefined && bothSplits && <Dropdown.Item onClick={e => handleToolsClick('skipToMSI', e)}>Skip To Spring Playoffs</Dropdown.Item>}
                {lid !== undefined && bothSplits && <Dropdown.Item onClick={e => handleToolsClick('skipToMidseason', e)}>Skip To Midseason</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item onClick={e => handleToolsClick('skipToPlayoffs', e)}>Skip To Summer Playoffs</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item onClick={e => handleToolsClick('skipToBeforeDraft', e)}>Skip To Before Resigning</Dropdown.Item>}
                {lid !== undefined && <Dropdown.Item onClick={e => handleToolsClick('skipToPreseason', e)}>Skip To Preseason</Dropdown.Item>}
                <Dropdown.Item onClick={e => handleToolsClick('resetDb', e)}>Reset DB</Dropdown.Item>
            </TopMenuDropdown>
            <TopMenuDropdown long="Help" short="?" openId={openId} onToggle={handleTopMenuToggle}>
                <Dropdown.Item href="/manual">Overview</Dropdown.Item>
                <Dropdown.Item href="/changes">Changes</Dropdown.Item>
                <Dropdown.Item href="/debugging">Debugging</Dropdown.Item>
                <Dropdown.Item href="/customRosters">Customization</Dropdown.Item>
            </TopMenuDropdown>
        </Nav>
    );
};

type LogoAndTextProps = {
    lid?: number;
    updating: boolean;
};

const LogoAndText: React.FC<LogoAndTextProps> = ({ lid, updating }) => {
    return (
        <a className="navbar-brand" href="/">
            <span className="hidden-md hidden-sm hidden-xs">
                <img src={IMAGES.img1} alt="MOBA GM Logo" />
            </span>
            {lid === undefined && <span className="visible-md visible-sm visible-xs">MOBA GM</span>}
        </a>
    );
};

const handleOptionClick = (option, e) => {
    if (!option.url) {
        e.preventDefault();
        toWorker(`actions.playMenu.${option.id}`);
    }
};

type PlayMenuProps = {
    lid?: number;
    options: Option[];
};

const PlayMenu = forwardRef<HTMLDivElement, PlayMenuProps>(({ lid, options }, ref) => {
    const handleAltP = (e: KeyboardEvent) => {
        if (e.altKey && e.keyCode === 80) {
            const option = options[0];
            if (!option) return;

            if (option.url) {
                realtimeUpdate([], option.url);
            } else {
                toWorker(`actions.playMenu.${option.id}`);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', handleAltP);
        return () => {
            document.removeEventListener('keyup', handleAltP);
        };
    }, [options]);

    if (lid === undefined) {
        return <div />;
    }

    return (
        <div ref={ref}>
            <ul className="nav navbar-nav-no-collapse">
                <Dropdown as="li" id="play-button-link">
                    <Dropdown.Toggle as="a">
                        <span className="hidden-xs">Play</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {options.map((option, i) => (
                            <Dropdown.Item
                                key={i}
                                href={option.url}
                                onClick={e => handleOptionClick(option, e)}
                            >
                                {option.label}
                                {i === 0 && <span className="text-muted kbd">Alt+P</span>}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </div>
    );
});

type NavBarProps = {
    hasViewedALeague: boolean;
    lid?: number;
    gameType: number;
    godMode: boolean;
    bothSplits: boolean;
    options: Option[];
    phaseText: string;
    popup: boolean;
    statusText: string;
    updating: boolean;
    username?: string;
};

const NavBar: React.FC<NavBarProps> = ({
    hasViewedALeague,
    lid,
    gameType,
    godMode,
    bothSplits,
    options,
    phaseText,
    popup,
    statusText,
    updating,
    username
}) => {
    const [hasViewed, setHasViewed] = useState(hasViewedALeague);
    const playMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const navBar = document.querySelector('div.navbar-collapse');
        const btnToggle = document.querySelector('button.navbar-toggle');

        if (!navBar || !btnToggle) return;

        const handleClick = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;
            if (!target) return;

            if (target.classList.contains('dropdown-toggle') ||
                !navBar.classList.contains('in') ||
                target.getAttribute("role") !== "menuitem") {
                return;
            }

            if (target.tagName === 'A' || target.classList.contains('toggle-responsive-menu')) {
                (btnToggle as HTMLElement).click();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    if (popup) {
        return <div />;
    }

    if (lid === undefined) {
        if (document.location.pathname === '/') {
            document.body.classList.remove('changedBg');
            document.body.classList.add('changedBg');

            return <nav className="navbar" role="navigation">
                <div className="navbar-header moba-logo1">
                    <a href="/">
                        <img src={IMAGES.img1} alt="MOBA GM Logo" />
                    </a>
                </div>
                <div className="dropdown-wrapper1 navbar-right">
                    <DropdownLinks gameType={gameType} bothSplits={bothSplits} godMode={godMode} lid={lid} />
                </div>
            </nav>;
        } else if (document.location.pathname === '/new_league') {
            return <nav className="navbar" role="navigation">
                <div className="navbar-header moba-logo1 moba-logo2">
                    <a href="/">
                        <img src="../img/moba-logo2.png" alt="MOBA GM Logo" />
                    </a>
                </div>
                <div className="dropdown-wrapper1 navbar-right dropdown-wrapper2">
                    <DropdownLinks gameType={gameType} bothSplits={bothSplits} godMode={godMode} lid={lid} />
                </div>
            </nav>;
        }
    } else {
        if (document.location.pathname === '/') {
            if (g.standardBackground) {
                document.body.classList.remove('changedBg');
                document.body.classList.remove('changedBgGreen');
                document.body.classList.add('changedBg');
            } else {
                document.body.classList.remove('changedBgGreen');
                document.body.classList.remove('changedBg');
                document.body.classList.add('changedBg');
            }

            return <nav className="navbar" role="navigation">
                <div className="navbar-header moba-logo1">
                    <a href="/">
                        <img src={IMAGES.img1} alt="MOBA GM Logo" />
                    </a>
                </div>
                <div className="dropdown-wrapper1 navbar-right">
                    <DropdownLinks gameType={gameType} bothSplits={bothSplits} godMode={godMode} lid={lid} />
                </div>
            </nav>;
        } else if (document.location.pathname === '/new_league') {
            if (!g.standardBackground) {
                document.body.classList.remove('changedBgGreen');
                document.body.classList.remove('changedBg');
                document.body.classList.add('changedBgGreen');
            } else {
                document.body.classList.remove('changedBgGreen');
                document.body.classList.remove('changedBg');
            }

            return <nav className="navbar" role="navigation">
                <div className="navbar-header moba-logo1 moba-logo2">
                    <a href="/">
                        <img src="../img/moba-logo2.png" alt="MOBA GM Logo" />
                    </a>
                </div>
                <div className="dropdown-wrapper1 navbar-right dropdown-wrapper2">
                    <DropdownLinks gameType={gameType} bothSplits={bothSplits} godMode={godMode} lid={lid} />
                </div>
            </nav>;
        }
    }

    return (
        <Navbar fixed="top" id="top-menu">
            <div className="navbar-header">
                <LogoAndText lid={lid} updating={updating} />
                <PlayMenu
                    lid={lid}
                    options={options}
                    ref={playMenuRef}
                />
                <Overlay
                    onHide={() => {
                        setHasViewed(true);
                        localStorage.setItem('hasViewedALeague', 'true');
                    }}
                    placement="bottom"
                    rootClose
                    show={!hasViewed && lid === 1}
                    target={() => playMenuRef.current}
                >
                    <Popover id="popover-welcome" title="Welcome to MOBA GM!">
                        To advance through the game, use the Play button at the top. The options shown will change depending on the current state of the game.
                    </Popover>
                </Overlay>
                {lid !== undefined && (
                    <p className="navbar-text-two-line-no-collapse">
                        <span>{phaseText}</span><br />
                        <span>{statusText}</span>
                    </p>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse className="navbar-right">
                <DropdownLinks
                    gameType={gameType}
                    bothSplits={bothSplits}
                    godMode={godMode}
                    lid={lid}
                />
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
