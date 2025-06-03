import classNames from 'classnames';
import {g, helpers} from '../../common';
import {setTitle} from '../util';
import {PlayerNameLabels} from '../components';
import { FC, useEffect, useRef, useState } from 'react';

interface Player {
    pid: number;
    userID: string;
    pos: string;
    champPicked: string;
    min: number;
    fg: number;
    fga: number;
    fgp: number;
    fgAtRim: number;
    fgaAtRim: number;
    fgpAtRim: number;
    tp: number;
    ft: number;
    orb: number;
    pf: number;
    fgLowPost: number;
    fgaLowPost: number;
    fgMidRange: number;
    oppJM: number;
    trb: number;
    inGame: boolean;
    injury?: any;
    skills?: any;
}

interface Team {
    abbrev: string;
    region: string;
    name: string;
    pf: number;
    ptsQtrs: number[];
    fg: number;
    fga: number;
    fgp: number;
    trb: number;
    drb: number;
    tov: number;
    fgaLowPost: number;
    fgAtRim: number;
    fgaAtRim: number;
    fgpAtRim: number;
    tp: number;
    ft: number;
    orb: number;
    fgLowPost: number;
    fgMidRange: number;
    oppJM: number;
    players: Player[];
    ban: Array<{ban: string}>;
}

interface BoxScore {
    teams: Team[];
    season: number;
    overtime: string;
    time: string;
    gameOver: boolean;
    att: number;
    gid: number;
    home: boolean;
    players: Player[];
    min: number;
    fg: number;
    fga: number;
    tp: number;
    tpa: number;
    ft: number;
    fta: number;
    orb: number;
    drb: number;
    trb: number;
    ast: number;
    tov: number;
    stl: number;
    blk: number;
    ba: number;
    pf: number;
    pts: number;
    pm: number;
}

interface Event {
    type: string;
    time?: string;
    text?: string;
    t?: number;
    p?: number;
    s?: string;
    amt?: number;
    on?: number;
    off?: number;
}

interface PlayerRowProps {
    i: number;
    p: Player;
}

const PlayerRow: FC<PlayerRowProps> = ({i, p}) => {
    const prevInGameRef = useRef(p.inGame);

    useEffect(() => {
        prevInGameRef.current = p.inGame;
    }, [p.inGame]);

    const classes = classNames({
        separator: i === 4,
        warning: p.inGame,
    });

    return (
        <tr className={classes}>
            <td>
                <PlayerNameLabels
                    injury={p.injury}
                    pid={p.pid}
                    skills={p.skills}
                >{p.userID}</PlayerNameLabels>
            </td>
            <td>{p.pos}</td>
            <td>{p.champPicked}</td>
            <td>{p.min.toFixed(1)}</td>
            <td>{p.fg}-{p.fga}-{p.fgp}</td>
            <td>{p.fgAtRim}-{p.fgaAtRim}-{p.fgpAtRim}</td>
            <td>{p.tp}</td>
            <td>{p.ft}</td>
            <td>{p.orb}-{p.pf}</td>
            <td>{p.fgLowPost}-{p.fgaLowPost}</td>
            <td>{p.fgMidRange}-{p.oppJM}</td>
            <td>{p.trb.toFixed(1)}</td>
        </tr>
    );
};

interface BoxScoreProps {
    boxScore: BoxScore;
}

const BoxScore: FC<BoxScoreProps> = ({boxScore}) => {
    return (
        <div className="row">
            <div className="col-sm-6">
                <h3>
                    <span className={boxScore.home ? 'text-danger' : 'text-primary'}>
                        {boxScore.home ? 'Home' : 'Away'}
                    </span>
                </h3>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-condensed table-hover">
                        <thead>
                            <tr>
                                <th style={{width: '100%'}}>Name</th>
                                <th style={{textAlign: 'right'}}>Min</th>
                                <th style={{textAlign: 'right'}}>FG</th>
                                <th style={{textAlign: 'right'}}>3Pt</th>
                                <th style={{textAlign: 'right'}}>FT</th>
                                <th style={{textAlign: 'right'}}>ORB</th>
                                <th style={{textAlign: 'right'}}>DRB</th>
                                <th style={{textAlign: 'right'}}>REB</th>
                                <th style={{textAlign: 'right'}}>AST</th>
                                <th style={{textAlign: 'right'}}>TO</th>
                                <th style={{textAlign: 'right'}}>STL</th>
                                <th style={{textAlign: 'right'}}>BLK</th>
                                <th style={{textAlign: 'right'}}>BA</th>
                                <th style={{textAlign: 'right'}}>PF</th>
                                <th style={{textAlign: 'right'}}>Pts</th>
                                <th style={{textAlign: 'right'}}>+/-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boxScore.players.map((p, i) => (
                                <PlayerRow key={i} p={p} i={i} />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Team</td>
                                <td style={{textAlign: 'right'}}>{boxScore.min.toFixed(1)}</td>
                                <td style={{textAlign: 'right'}}>{`${boxScore.fg}-${boxScore.fga}`}</td>
                                <td style={{textAlign: 'right'}}>{`${boxScore.tp}-${boxScore.tpa}`}</td>
                                <td style={{textAlign: 'right'}}>{`${boxScore.ft}-${boxScore.fta}`}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.orb}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.drb}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.trb}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.ast}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.tov}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.stl}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.blk}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.ba}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.pf}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.pts}</td>
                                <td style={{textAlign: 'right'}}>{boxScore.pm}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

interface LiveGameProps {
    events?: Event[];
    initialBoxScore?: BoxScore;
}

const LiveGame: FC<LiveGameProps> = ({events: initialEvents, initialBoxScore}) => {
    const [boxScore, setBoxScore] = useState<BoxScore>(initialBoxScore || {} as BoxScore);
    const [speed, setSpeed] = useState(5);
    const [started, setStarted] = useState(!!initialEvents);
    const playByPlayDivRef = useRef<HTMLDivElement>(null);
    const componentIsMountedRef = useRef(true);

    useEffect(() => {
        setTitle('Live Game Simulation');

        const setPlayByPlayDivHeight = () => {
            if (playByPlayDivRef.current) {
                playByPlayDivRef.current.style.height = `${window.innerHeight - 104}px`;
            }
        };

        window.addEventListener("resize", setPlayByPlayDivHeight);
        setPlayByPlayDivHeight();

        return () => {
            componentIsMountedRef.current = false;
            window.removeEventListener("resize", setPlayByPlayDivHeight);
        };
    }, []);

    useEffect(() => {
        if (initialEvents && !started) {
            setBoxScore(initialBoxScore || {} as BoxScore);
            setStarted(true);
            startLiveGame([...initialEvents]);
        }
    }, [initialEvents, started, initialBoxScore]);

    const startLiveGame = (events: Event[]) => {
        let overtimes = 0;

        const processToNextPause = () => {
            if (!componentIsMountedRef.current) {
                return;
            }

            const currentBoxScore = {...boxScore};
            let stop = false;
            let text = null;
            let text2 = "";

            while (!stop && events.length > 0) {
                const e = events.shift();
                if (!e) continue;

                if (e.type === "text") {
                    if (e.t === 0 || e.t === 1) {
                        text = `${e.time} - ${currentBoxScore.teams[e.t].abbrev} - ${e.text}`;
                    } else {
                        text = e.text;
                    }

                    if (text?.includes('made')) {
                        text += ` (${currentBoxScore.teams[0].pf}-${currentBoxScore.teams[1].pf})`;
                    }

                    if (text.indexOf(" Tower") >= 0) {
                        if (e.t===0) {
                            text2 += ` (Towers ${currentBoxScore.teams[0].pf+1}-${currentBoxScore.teams[1].pf})`;
                        } else {
                            text2 += ` (Towers ${currentBoxScore.teams[0].pf}-${currentBoxScore.teams[1].pf+1})`;
                        }
                    } else  if (text.indexOf("the Rift") >= 0) {
                        if (e.t===0) {
                            text2 += ` (Rift Herald ${currentBoxScore.teams[0].drb+1}-${currentBoxScore.teams[1].drb})`;
                        } else {
                            text2 += ` (Rift Herald ${currentBoxScore.teams[0].drb}-${currentBoxScore.teams[1].drb+1})`;
                        }
                    } else  if (text.indexOf("the Dragon") >= 0) {
                        if (e.t===0) {
                            text2 += ` (Dragons ${currentBoxScore.teams[0].drb+1}-${currentBoxScore.teams[1].drb})`;
                        } else {
                            text2 += ` (Dragons ${currentBoxScore.teams[0].drb}-${currentBoxScore.teams[1].drb+1})`;
                        }
                    } else  if (text.indexOf("the Baron") >= 0) {
                            if (e.t===0) {
                                text2 += ` (Barons ${currentBoxScore.teams[0].tov+1}-${currentBoxScore.teams[1].tov})`;
                            } else {
                                text2 += ` (Barons ${currentBoxScore.teams[0].tov}-${currentBoxScore.teams[1].tov+1})`;
                            }
                    } else  if (text.indexOf("the Roshan") >= 0) {
                            if (e.t===0) {
                                text2 += ` (Roshans ${currentBoxScore.teams[0].tov+1}-${currentBoxScore.teams[1].tov})`;
                            } else {
                                text2 += ` (Roshans ${currentBoxScore.teams[0].tov}-${currentBoxScore.teams[1].tov+1})`;
                            }
                    } else  if ((text.indexOf("killing") >= 0) || (text.indexOf("killed") >= 0)) {
                        if (e.t===0) {
                            text2 += ` (Kills ${currentBoxScore.teams[0].fg+1}-${currentBoxScore.teams[1].fg})`;
                        } else {
                            text2 += ` (Kills ${currentBoxScore.teams[0].fg}-${currentBoxScore.teams[1].fg+1})`;
                        }
                    }

                    if ((text.indexOf("destroyed the Nexus")   >= 0 )|| (text.indexOf("destroyed the Ancient")  >= 0)) {
                            text2 += `. ${currentBoxScore.teams[e.t].name} has won the game.`;
                    }

                    if (text.indexOf("Outer Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[0] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }

                    if (text.indexOf("Dragon") >= 0) {
                        if (text.indexOf("killed") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[6] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                        }
                    }
                    if (text.indexOf("Rift") >= 0) {
                        if (text.indexOf("killed") >= 0) {
                        }
                    }

                    if (text.indexOf("Baron") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[7] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }
                    if (text.indexOf("Roshan") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[7] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }
                   if (text.indexOf("Inner Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[1] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }

                    if (text.indexOf("Inhibitor Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[2] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    } else if (text.indexOf("Inhibitor") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[3] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                            if (e.t===0) {
                                text2 += ` (Inhibitors ${currentBoxScore.teams[0].fgaLowPost+1}-${currentBoxScore.teams[1].fgaLowPost})`;
                            } else {
                                text2 += ` (Inhibitors ${currentBoxScore.teams[0].fgaLowPost}-${currentBoxScore.teams[1].fgaLowPost+1})`;
                            }
                    }
                    if (text.indexOf("Barracks Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[2] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    } else if (text.indexOf("Barracks") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[3] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                            if (e.t===0) {
                                text2 += ` (Barracks ${currentBoxScore.teams[0].fgaLowPost+1}-${currentBoxScore.teams[1].fgaLowPost})`;
                            } else {
                                text2 += ` (Barracks ${currentBoxScore.teams[0].fgaLowPost}-${currentBoxScore.teams[1].fgaLowPost+1})`;
                            }
                    }

                    if (text.indexOf("Nexus Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[4] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    } else if (text.indexOf("Nexus") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[5] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }
                    if (text.indexOf("Ancient Tower") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[4] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    } else if (text.indexOf("Ancient") >= 0) {
                            let ptsQtrs = currentBoxScore.teams[e.t].ptsQtrs;
                            ptsQtrs[5] += 1;
                            currentBoxScore.teams[e.t].ptsQtrs = ptsQtrs;
                    }

                    if (text.indexOf("picked") >= 0) {
                        var fullText = e.text;
                        var n = fullText.split(" ");
                        var t, l;

                        for (l = 0; l < 5; l++) {
                            for (t = 0; t < 2; t++) {
                                if  (currentBoxScore.teams[t].players[l].userID == n[n.length - 3]) {
                                    currentBoxScore.teams[t].players[l].champPicked = n[n.length - 1];
                                    t = 2;
                                    l = 5;
                                }
                            }
                        }
                    }

                    currentBoxScore.time = e.time;
                    stop = true;
                } else if (e.type === "sub") {
                    for (let i = 0; i < currentBoxScore.teams[e.t!].players.length; i++) {
                        if (currentBoxScore.teams[e.t!].players[i].pid === e.on) {
                            currentBoxScore.teams[e.t!].players[i].inGame = true;
                        } else if (currentBoxScore.teams[e.t!].players[i].pid === e.off) {
                            currentBoxScore.teams[e.t!].players[i].inGame = false;
                        }
                    }
                } else if (e.type === "stat") {
                    if (e.s === "drb") {
                        currentBoxScore.teams[e.t].players[e.p][e.s] = currentBoxScore.teams[e.t].players[e.p][e.s] + e.amt;
                        currentBoxScore.teams[e.t][e.s] = currentBoxScore.teams[e.t][e.s] + e.amt;
                    } else if (e.s === "orb") {
                        currentBoxScore.teams[e.t].players[e.p][e.s] = currentBoxScore.teams[e.t].players[e.p][e.s] + e.amt;
                        currentBoxScore.teams[e.t][e.s] = currentBoxScore.teams[e.t][e.s] + e.amt;
                    } else if (e.s === "ban") {
                        currentBoxScore.teams[e.t].ban[e.p][e.s] = String(e.amt);
                    } else if (e.s === "champPicked") {
                        currentBoxScore.teams[e.t].players[e.p][e.s] = String(e.amt);
                    } else if (e.s ===  "fgaAtRim" || e.s ===  "fgAtRim" || e.s ===  "fgpAtRim" || e.s === "fgp" || e.s === "min" || e.s === "trb" ||e.s === "oppJM" || e.s === "fgaLowPost" || e.s === "fgLowPost" || e.s === "fgaMidRange" || e.s === "fgMidRange" || e.s === "min" || e.s === "fg" || e.s === "fga" || e.s === "tp" || e.s === "tpa" || e.s === "ft" || e.s === "fta" || e.s === "ast" || e.s === "tov" || e.s === "stl" || e.s === "blk" || e.s === "pf" ) {
                        currentBoxScore.teams[e.t].players[e.p][e.s] = currentBoxScore.teams[e.t].players[e.p][e.s] + e.amt;
                        currentBoxScore.teams[e.t][e.s] = currentBoxScore.teams[e.t][e.s] + e.amt;
                    }
                }
            }

            if (text !== null && playByPlayDivRef.current) {
                const p = document.createElement("p");
                const t = document.createTextNode(text);
                const t2 = document.createTextNode(text2);
                const b = document.createElement("b");

                b.setAttribute('style', 'color: white');
                b.appendChild(t2);
                p.appendChild(t);
                p.appendChild(b);

                playByPlayDivRef.current.insertBefore(p, playByPlayDivRef.current.firstChild);
            }

            if (events.length > 0) {
                setTimeout(processToNextPause, 4000 / (1.2 ** speed));
            } else {
                currentBoxScore.time = '0:00';
                currentBoxScore.gameOver = true;
            }

            setBoxScore(currentBoxScore);
        };

        processToNextPause();
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(Number(e.target.value));
    };

    return (
        <div>
            <h1>Live Game Simulation</h1>

            <p className="text-danger">
                If you navigate away from this page, you won't be able to see these play-by-play results again because they are not stored anywhere. The results of this game are already final, though.
            </p>
            <div className="row">
                <div className="col-md-9">
                    {boxScore.gid >= 0 ? <BoxScore boxScore={boxScore} /> : <h1>Loading...</h1>}
                </div>
                <div className="col-md-3">
                    <div style={{ position: 'sticky', top: '60px' }}>
                        <div>
                            <form>
                                <label htmlFor="playByPlaySpeed">Play-By-Play Speed:</label>
                                <input
                                    type="range"
                                    id="playByPlaySpeed"
                                    min="1"
                                    max="33"
                                    step="1"
                                    style={{width: '100%'}}
                                    value={speed}
                                    onChange={handleSpeedChange}
                                />
                            </form>
                            <div
                                ref={playByPlayDivRef}
                                style={{height: '100%', overflow: 'auto'}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveGame;
